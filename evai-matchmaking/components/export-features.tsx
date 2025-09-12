"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockPlayers, calculatePlayerScore, type Player } from "@/lib/player-data"
import { analyzeTeamBalance } from "@/lib/team-balancing"
import { Download, FileJson, FileSpreadsheet, Share2, Copy, Check } from "lucide-react"

interface ExportFeaturesProps {
  teamData: {
    teamA: string[]
    teamB: string[]
    avgA: number
    avgB: number
    pA: number
    diff: number
  }
}

export function ExportFeatures({ teamData }: ExportFeaturesProps) {
  const [copied, setCopied] = useState(false)

  const getPlayerById = (id: string): Player | undefined => {
    return mockPlayers.find((player) => player.name === id || player.id === id)
  }

  const teamAPlayers = teamData.teamA.map((id) => getPlayerById(id)).filter(Boolean) as Player[]
  const teamBPlayers = teamData.teamB.map((id) => getPlayerById(id)).filter(Boolean) as Player[]
  const balanceAnalysis = analyzeTeamBalance(teamData)

  // Génération des données d'export
  const generateExportData = () => {
    const exportData = {
      matchId: `EVA_${Date.now()}`,
      timestamp: new Date().toISOString(),
      teams: {
        teamA: {
          name: "Équipe A",
          players: teamAPlayers.map((player) => ({
            id: player.id,
            name: player.name,
            rank: player.rank,
            team: player.team,
            stats: player.stats,
            calculatedScore: calculatePlayerScore(player),
          })),
          averageWinrate: teamData.avgA,
          winProbability: teamData.pA,
        },
        teamB: {
          name: "Équipe B",
          players: teamBPlayers.map((player) => ({
            id: player.id,
            name: player.name,
            rank: player.rank,
            team: player.team,
            stats: player.stats,
            calculatedScore: calculatePlayerScore(player),
          })),
          averageWinrate: teamData.avgB,
          winProbability: 1 - teamData.pA,
        },
      },
      balance: {
        difference: teamData.diff,
        differencePercent: Math.abs(teamData.diff) * 100,
        quality: balanceAnalysis.balanceQuality,
        message: balanceAnalysis.balanceMessage,
        isBalanced: balanceAnalysis.isBalanced,
      },
      algorithm: {
        scoreFormula: "0.4 × Winrate + 0.3 × K/D + 0.2 × Dégâts moyens + 0.1 × Assists",
        balancingMethod: "Alternating assignment based on calculated scores",
      },
    }
    return exportData
  }

  // Export JSON
  const exportToJSON = () => {
    const data = generateExportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `EVA_Teams_${data.matchId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Export CSV/Excel
  const exportToCSV = () => {
    const data = generateExportData()

    // En-têtes CSV
    const headers = [
      "Équipe",
      "Joueur",
      "Rang",
      "Team_Origin",
      "Winrate",
      "K/D",
      "Dégâts_Moy",
      "Assists",
      "Death_Time",
      "Score_Total",
      "Temps_Jeu",
      "Score_Calculé",
    ]

    // Données des joueurs
    const rows = [
      ...data.teams.teamA.players.map((player) => [
        "A",
        player.name,
        player.rank,
        player.team || "",
        player.stats.winrate,
        player.stats.kd,
        player.stats.avgDamage,
        player.stats.assists,
        player.stats.deathTime,
        player.stats.score,
        player.stats.playTime,
        player.calculatedScore.toFixed(4),
      ]),
      ...data.teams.teamB.players.map((player) => [
        "B",
        player.name,
        player.rank,
        player.team || "",
        player.stats.winrate,
        player.stats.kd,
        player.stats.avgDamage,
        player.stats.assists,
        player.stats.deathTime,
        player.stats.score,
        player.stats.playTime,
        player.calculatedScore.toFixed(4),
      ]),
    ]

    // Ajout des statistiques d'équipe
    rows.push([])
    rows.push(["STATISTIQUES D'ÉQUIPE"])
    rows.push(["Équipe A - Winrate Moyen", data.teams.teamA.averageWinrate.toFixed(4)])
    rows.push(["Équipe A - Probabilité Victoire", (data.teams.teamA.winProbability * 100).toFixed(2) + "%"])
    rows.push(["Équipe B - Winrate Moyen", data.teams.teamB.averageWinrate.toFixed(4)])
    rows.push(["Équipe B - Probabilité Victoire", (data.teams.teamB.winProbability * 100).toFixed(2) + "%"])
    rows.push(["Différence d'équilibrage", data.balance.differencePercent.toFixed(2) + "%"])
    rows.push(["Qualité d'équilibrage", data.balance.quality])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `EVA_Teams_${data.matchId}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Copier vers le presse-papiers
  const copyToClipboard = async () => {
    const data = generateExportData()
    const textData = `
🎮 EVAi MatchMaking - Composition d'Équipes
═══════════════════════════════════════════

📊 ÉQUIPE A (Prob. victoire: ${(data.teams.teamA.winProbability * 100).toFixed(1)}%)
${data.teams.teamA.players.map((p) => `• ${p.name} (${p.rank}) - Score: ${p.calculatedScore.toFixed(2)}`).join("\n")}

📊 ÉQUIPE B (Prob. victoire: ${(data.teams.teamB.winProbability * 100).toFixed(1)}%)
${data.teams.teamB.players.map((p) => `• ${p.name} (${p.rank}) - Score: ${p.calculatedScore.toFixed(2)}`).join("\n")}

⚖️ ÉQUILIBRAGE
Différence: ${data.balance.differencePercent.toFixed(2)}%
Qualité: ${data.balance.quality}
${data.balance.message}

🔧 Algorithme: ${data.algorithm.scoreFormula}
📅 Généré le: ${new Date(data.timestamp).toLocaleString("fr-FR")}
    `.trim()

    try {
      await navigator.clipboard.writeText(textData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erreur lors de la copie:", err)
    }
  }

  // Partager (Web Share API si disponible)
  const shareTeams = async () => {
    const data = generateExportData()
    const shareData = {
      title: "EVAi MatchMaking - Composition d'Équipes",
      text: `Équipes générées avec ${data.balance.differencePercent.toFixed(1)}% de différence`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error("Erreur lors du partage:", err)
        copyToClipboard() // Fallback vers copie
      }
    } else {
      copyToClipboard() // Fallback si Web Share API non disponible
    }
  }

  return (
    <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Download className="w-5 h-5" />
          Export et Partage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Résumé rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{teamData.teamA.length + teamData.teamB.length}</div>
            <div className="text-sm text-muted-foreground">Joueurs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">{balanceAnalysis.diffPercent.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Différence</div>
          </div>
          <div className="text-center">
            <div
              className={`text-lg font-bold ${
                balanceAnalysis.balanceQuality === "excellent"
                  ? "text-green-400"
                  : balanceAnalysis.balanceQuality === "good"
                    ? "text-yellow-400"
                    : "text-orange-400"
              }`}
            >
              {balanceAnalysis.balanceQuality === "excellent"
                ? "Excellent"
                : balanceAnalysis.balanceQuality === "good"
                  ? "Bon"
                  : balanceAnalysis.balanceQuality === "fair"
                    ? "Correct"
                    : "Faible"}
            </div>
            <div className="text-sm text-muted-foreground">Équilibrage</div>
          </div>
        </div>

        {/* Boutons d'export */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={exportToJSON}
            variant="outline"
            className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 bg-transparent"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </Button>

          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2 border-secondary/30 hover:bg-secondary/10 bg-transparent"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </Button>

          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex items-center gap-2 border-accent/30 hover:bg-accent/10 bg-transparent"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copié !" : "Copier"}
          </Button>

          <Button
            onClick={shareTeams}
            variant="outline"
            className="flex items-center gap-2 border-chart-5/30 hover:bg-chart-5/10 bg-transparent"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
        </div>

        {/* Informations sur les exports */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Formats d'Export Disponibles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <FileJson className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="text-primary border-primary/30">
                  JSON
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Format structuré avec toutes les données détaillées, métadonnées et statistiques d'équilibrage.
              </p>
            </div>

            <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet className="w-4 h-4 text-secondary" />
                <Badge variant="outline" className="text-secondary border-secondary/30">
                  CSV/Excel
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Tableau compatible Excel avec stats individuelles et résumé d'équipe pour analyse.
              </p>
            </div>
          </div>
        </div>

        {/* Aperçu des données */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Aperçu des Données Exportées</h4>
          <div className="p-3 bg-muted/10 rounded-lg border border-border/30 text-xs font-mono">
            <div className="text-muted-foreground">
              {`{
  "matchId": "EVA_${Date.now()}",
  "teams": {
    "teamA": { "players": [${teamAPlayers.length}], "winProbability": ${(teamData.pA * 100).toFixed(1)}% },
    "teamB": { "players": [${teamBPlayers.length}], "winProbability": ${((1 - teamData.pA) * 100).toFixed(1)}% }
  },
  "balance": { "difference": ${balanceAnalysis.diffPercent.toFixed(2)}%, "quality": "${balanceAnalysis.balanceQuality}" }
}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
