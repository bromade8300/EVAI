import json
import statistics

def monitor_logs(log_file="logs.json"):
    alerts = []
    winrates = []
    total_entries = 0
    anomalies = 0

    with open(log_file, "r") as f:
        for line in f:
            total_entries += 1
            entry = json.loads(line)
            players = entry["players"]
            winrate_a = entry["winrate_a"]
            winrate_b = entry["winrate_b"]

            winrates.append(winrate_a)

            # Vérification 1 : 8 joueurs
            if len(players) != 8:
                alerts.append(f"[ALERTE] Mauvais nombre de joueurs: {players}")
                anomalies += 1

            # Vérification 2 : doublons
            if len(players) != len(set(players)):
                alerts.append(f"[ALERTE] Doublons détectés: {players}")
                anomalies += 1

            # Vérification 3 : winrate trop déséquilibré
            if abs(winrate_a - 0.5) > 0.15:  # plus de 65-35
                alerts.append(f"[ALERTE] Winrate déséquilibré: {winrate_a:.2f} / {winrate_b:.2f}")
                anomalies += 1

    # Affichage des statistiques globales
    if winrates:
        mean_winrate = statistics.mean(winrates)
        stdev_winrate = statistics.pstdev(winrates)
        percent_unbalanced = sum(1 for w in winrates if abs(w - 0.5) > 0.15) / len(winrates) * 100

        print("\n📊 ---- TABLEAU DE BORD ---- 📊")
        print(f"Nombre total de logs analysés : {total_entries}")
        print(f"Moyenne winrate équipe A     : {mean_winrate:.3f}")
        print(f"Écart-type des winrates      : {stdev_winrate:.3f}")
        print(f"Cas déséquilibrés (>65/35)   : {percent_unbalanced:.1f}%")
        print(f"Nombre total d'anomalies     : {anomalies}")
        print("🟢 État général : ", "OK ✅" if anomalies == 0 else "⚠️ Anomalies détectées")
    else:
        print("⚠️ Aucun log trouvé dans le fichier.")

    # Affichage des alertes détectées
    if alerts:
        print("\n⚠️ ---- ALERTES ---- ⚠️")
        for a in alerts:
            print(a)

if __name__ == "__main__":
    monitor_logs()