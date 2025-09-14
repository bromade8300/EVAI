import pandas as pd, numpy as np, itertools, datetime as dt, json
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import random


# --------- 1) charger le fichier (mettre le bon chemin) ----------
file_path = "StatsjoueursLIGUE.xlsx"
df = pd.read_excel(file_path)

# --------- 2) nettoyer / convertir les temps en secondes ----------
def time_to_seconds(x):
    if pd.isna(x): return np.nan
    if isinstance(x, dt.time):
        return x.hour*3600 + x.minute*60 + x.second + x.microsecond/1e6
    s = str(x)
    try:
        parts = s.split(':')
        if len(parts)==3:
            h,m,sec = parts
            return int(h)*3600 + int(m)*60 + float(sec)
    except:
        pass
    try:
        return float(s)
    except:
        return np.nan

for c in ['Temps total','Temps mort']:
    if c in df.columns:
        df[c + '_s'] = df[c].apply(time_to_seconds)

# --------- 3) numeric features & matches ----------
df['Victoires'] = pd.to_numeric(df['Victoires'], errors='coerce').fillna(0)
df['Défaites'] = pd.to_numeric(df['Défaites'], errors='coerce').fillna(0)
df['Matches'] = df['Victoires'] + df['Défaites']

numeric_cols = ['Score', 'Tués', 'Assist', 'Morts', 'Dégâts', 'temps mort %', 'Temps total_s', 'Temps mort_s', 'Matches']
available_features = [c for c in numeric_cols if c in df.columns]

# --------- 4) agrégation par joueur (moyennes) ----------
df_player_mean = df.groupby('Joueur')[available_features + ['Ratio Victoire']].mean().reset_index()
df_player_matches_total = df.groupby('Joueur')['Matches'].sum().reset_index().rename(columns={'Matches':'Matches_total'})
df_player = df_player_mean.merge(df_player_matches_total, on='Joueur', how='left')

# --------- 5) entraînement du modèle ----------
X = df_player[available_features].copy()
y = df_player['Ratio Victoire'].copy()
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('model', RandomForestRegressor(n_estimators=300, random_state=42))
])
scores = cross_val_score(pipeline, X, y, cv=5, scoring='r2')
print("Cross-val R2 scores:", scores, "mean:", scores.mean())
pipeline.fit(X, y)
model = pipeline.named_steps['model']
importances = model.feature_importances_
feat_imp = pd.DataFrame({'feature': available_features, 'importance': importances}).sort_values('importance', ascending=False)
print("\nFeature importances (top):")
print(feat_imp.head(20).to_string(index=False))

# --------- 6) prédiction individuelle et fonction d'équilibrage ----------
def predict_ratio_by_name(name):
    row = df_player[df_player['Joueur']==name].iloc[0]
    Xrow = row[available_features].to_frame().T
    return float(pipeline.predict(Xrow)[0])

def best_splits_for_eight(player_names):
    players = df_player[df_player['Joueur'].isin(player_names)].copy()
    if len(players) != 8:
        raise ValueError(f"Found {len(players)} matching players, expected 8.")
    players['pred_ratio'] = players['Joueur'].apply(predict_ratio_by_name)
    names = players['Joueur'].tolist()
    preds = dict(zip(players['Joueur'], players['pred_ratio']))
    splits = []
    for combo in itertools.combinations(names, 4):
        teamA = set(combo)
        teamB = set(names) - teamA
        if min(teamA) > min(teamB):  # évite doublons miroir
            continue
        avgA = np.mean([preds[n] for n in teamA])
        avgB = np.mean([preds[n] for n in teamB])
        denom = (avgA + avgB)
        pA = avgA/denom if denom>0 else 0.5
        splits.append({
            'teamA': sorted(teamA),
            'teamB': sorted(teamB),
            'avgA': float(avgA),
            'avgB': float(avgB),
            'pA': float(pA),
            'diff': float(abs(pA-0.5))
        })
    return sorted(splits, key=lambda x: x['diff'])

# -------- 7) Fonction pour sortir le top 8 --------
def get_top8(df, col_score="Matches_total", col_player="Joueur"):
    """
    Retourne la liste des 8 meilleurs joueurs selon un score donné.
    """
    top8 = df.sort_values(col_score, ascending=False)[col_player].head(8).tolist()
    return top8

# -------- 8) Fonction de matchmaking (bracket simple) --------
def get_random8(df, col_player="Joueur"):
    """
    Tire 8 joueurs au hasard depuis un DataFrame.
    """
    if len(df) < 8:
        raise ValueError("Le DataFrame doit contenir au moins 8 joueurs.")
    return df[col_player].sample(8, random_state=None).tolist()

def make_matchmaking(df, col_player="Joueur"):
    """
    Tire 8 joueurs au hasard puis fait le meilleur matchmaking possible
    grâce à la fonction best_splits_for_eight.
    """
    players = get_random8(df, col_player=col_player)

    splits = best_splits_for_eight(players)  # ta fonction existante
    best = splits[0]  # premier élément = meilleur split

    return best

# -------- Exemple d'utilisation --------
matchmaking = make_matchmaking(df_player)

# -------- Export JSON --------
with open("meilleure_partition.json", "w", encoding="utf-8") as f:
    json.dump(matchmaking, f, ensure_ascii=False, indent=4)