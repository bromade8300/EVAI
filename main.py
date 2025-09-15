import pandas as pd, numpy as np, itertools, json, datetime as dt
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

# --------- 1) Charger le dataset historique (pour entraîner le modèle) ----------
file_path = "StatsjoueursLIGUE.xlsx"
df = pd.read_excel(file_path)

# Nettoyage : convertir colonnes numériques
df['Victoires'] = pd.to_numeric(df['Victoires'], errors='coerce').fillna(0)
df['Défaites'] = pd.to_numeric(df['Défaites'], errors='coerce').fillna(0)
df['Matches'] = df['Victoires'] + df['Défaites']

# Conversion des temps en secondes
def time_to_seconds(x):
    if pd.isna(x): return np.nan
    if isinstance(x, dt.time):
        return x.hour*3600 + x.minute*60 + x.second + x.microsecond/1e6
    try:
        h,m,s = str(x).split(":")
        return int(h)*3600 + int(m)*60 + float(s)
    except:
        return np.nan

for c in ['Temps total','Temps mort']:
    if c in df.columns:
        df[c + '_s'] = df[c].apply(time_to_seconds)

# Features utilisées
numeric_cols = ['Score','Tués','Assist','Morts','Dégâts',
                'temps mort %','Temps total_s','Temps mort_s','Matches']
available_features = [c for c in numeric_cols if c in df.columns]

# Agrégation par joueur
df_player = df.groupby('Joueur')[available_features + ['Ratio Victoire']].mean().reset_index()

# Entraînement du modèle
X = df_player[available_features].copy()
y = df_player['Ratio Victoire'].copy()
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('model', RandomForestRegressor(n_estimators=300, random_state=42))
])
pipeline.fit(X, y)

# --------- 2) Charger un JSON de 8 joueurs ----------
with open("joueurs.json", "r", encoding="utf-8") as f:
    players_json = json.load(f)

players_df = pd.DataFrame(players_json)
if len(players_df) != 8:
    raise ValueError("Le JSON doit contenir exactement 8 joueurs.")

# Prédire le ratio de victoire pour chaque joueur fourni
players_df['pred_ratio'] = pipeline.predict(players_df[available_features])

# --------- 3) Trouver les meilleures équipes ----------
def best_splits(players_df):
    names = players_df['Joueur'].tolist()
    preds = dict(zip(players_df['Joueur'], players_df['pred_ratio']))
    splits = []
    for combo in itertools.combinations(names, 4):
        teamA = set(combo)
        teamB = set(names) - teamA
        if min(teamA) > min(teamB):  # éviter doublons miroir
            continue
        avgA = np.mean([preds[n] for n in teamA])
        avgB = np.mean([preds[n] for n in teamB])
        denom = (avgA + avgB)
        pA = avgA/denom if denom>0 else 0.5
        splits.append({
            "teamA": sorted(teamA),
            "teamB": sorted(teamB),
            "avgA": float(avgA),
            "avgB": float(avgB),
            "pA": float(pA),
            "pB": float(1-pA),
            "diff": float(abs(pA-0.5))
        })
    return sorted(splits, key=lambda x: x["diff"])

results = best_splits(players_df)
best = results[0]

# --------- 4) Exporter la meilleure partition ----------
with open("meilleure_partition.json", "w", encoding="utf-8") as f:
    json.dump(best, f, ensure_ascii=False, indent=4)

print("Meilleure partition :")
print(json.dumps(best, indent=4, ensure_ascii=False))
