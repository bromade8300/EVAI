import pandas as pd
import numpy as np
import itertools
import json
import datetime as dt
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

# --------- 1) Charger le dataset historique (pour entraîner le modèle) ----------
try:
    file_path = "./public/script/StatsjoueursLIGUE.xlsx"
    df = pd.read_excel(file_path)
except FileNotFoundError:
    absolute_path = os.path.abspath(file_path)
    print(f"Chemin d'accès absolu recherché : {absolute_path}")
    print(f"Erreur : Le fichier {file_path} est introuvable. Veuillez vérifier son emplacement.")
    exit()
except Exception as e:
    print(f"Une erreur est survenue lors du chargement du fichier Excel : {e}")
    exit()

# Nettoyage : convertir colonnes numériques
try:
    df['Victoires'] = pd.to_numeric(df['Victoires'], errors='coerce').fillna(0)
    df['Défaites'] = pd.to_numeric(df['Défaites'], errors='coerce').fillna(0)
    df['Matches'] = df['Victoires'] + df['Défaites']

    # Conversion des temps en secondes
    def time_to_seconds(x):
        if pd.isna(x):
            return np.nan
        if isinstance(x, dt.time):
            return x.hour * 3600 + x.minute * 60 + x.second + x.microsecond / 1e6
        try:
            h, m, s = str(x).split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
        except:
            return np.nan

    for c in ['Temps total', 'Temps mort']:
        if c in df.columns:
            df[c + '_s'] = df[c].apply(time_to_seconds)

    # Features utilisées
    numeric_cols = ['Score', 'Tués', 'Assist', 'Morts', 'Dégâts',
                    'temps mort %', 'Temps total_s', 'Temps mort_s', 'Matches']
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
except Exception as e:
    print(f"Erreur lors de l'entraînement du modèle : {e}")
    exit()

# --------- 2) Charger un JSON de 8 joueurs ----------
try:
    with open("./public/scripts/playersJsonOutput.json", "r", encoding="utf-8") as f:
        players_json = json.load(f)
    players_df = pd.DataFrame(players_json)

    if len(players_df) != 8:
        raise ValueError("Le JSON doit contenir exactement 8 joueurs.")
except FileNotFoundError:
    print("Erreur : Le fichier joueurs.json est introuvable.")
    exit()
except json.JSONDecodeError:
    print("Erreur : Le fichier joueurs.json est mal formé.")
    exit()
except ValueError as e:
    print(f"Erreur : {e}")
    exit()
except Exception as e:
    print(f"Une erreur inattendue est survenue au chargement du JSON : {e}")
    exit()

# Prédire le ratio de victoire pour chaque joueur fourni
try:
    players_df['pred_ratio'] = pipeline.predict(players_df[available_features])
except KeyError as e:
    print(f"Erreur de colonne : Le JSON ne contient pas la colonne {e} nécessaire à la prédiction.")
    exit()
except Exception as e:
    print(f"Erreur lors de la prédiction : {e}")
    exit()

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
        pA = avgA / denom if denom > 0 else 0.5
        splits.append({
            "teamA": sorted(teamA),
            "teamB": sorted(teamB),
            "avgA": float(avgA),
            "avgB": float(avgB),
            "pA": float(pA),
            "pB": float(1 - pA),
            "diff": float(abs(pA - 0.5))
        })
    return sorted(splits, key=lambda x: x["diff"])

try:
    results = best_splits(players_df)
    best = results[0]
except IndexError:
    print("Erreur : Impossible de calculer les équipes. Assurez-vous d'avoir des données valides.")
    exit()
except Exception as e:
    print(f"Erreur lors du calcul des meilleures équipes : {e}")
    exit()

# --------- 4) Exporter la meilleure partition ----------
try:
    with open("meilleure_partition.json", "w", encoding="utf-8") as f:
        json.dump(best, f, ensure_ascii=False, indent=4)
    print("Meilleure partition exportée avec succès dans 'meilleure_partition.json'.")
except IOError:
    print("Erreur : Impossible d'écrire dans le fichier 'meilleure_partition.json'. Vérifiez les permissions.")
except Exception as e:
    print(f"Une erreur inattendue est survenue lors de l'exportation : {e}")

print("\nMeilleure partition trouvée :")
print(json.dumps(best, indent=4, ensure_ascii=False))

# --------- 5) Logging JSON pour la surveillance ---------
try:
    log_entry = {
        "timestamp": dt.datetime.now().isoformat(),
        "results": {
            "pA": best["pA"],
            "pB": best["pB"],
            "diff": best["diff"]
        }
    }

    logs = []
    log_file_path = "logs.json"

    # Charger l’historique existant
    if os.path.exists(log_file_path):
        with open(log_file_path, "r", encoding="utf-8") as log_file:
            for line in log_file:
                try:
                    logs.append(json.loads(line.strip()))
                except json.JSONDecodeError:
                    continue  # ignorer lignes corrompues

    # Ajouter la nouvelle exécution
    logs.append(log_entry)

    # Garder seulement les 10 dernières
    if len(logs) > 10:
        logs = logs[-10:]

    # Réécrire le fichier proprement (un JSON par ligne)
    with open(log_file_path, "w", encoding="utf-8") as log_file:
        for entry in logs:
            log_file.write(json.dumps(entry, ensure_ascii=False) + "\n")
            log_file.write("\n")

    print("\n✅ Log mis à jour (max 10 entrées conservées)")
except Exception as e:
    print(f"Erreur lors de la mise à jour du log : {e}")