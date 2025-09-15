import { mockPlayers, calculatePlayerScore, type Player } from "./player-data"

export interface TeamBalanceResult {
  teamA: string[]
  teamB: string[]
  avgA: number
  avgB: number
  pA: number
  diff: number
}

export function simulateAPICall(selectedPlayerIds: string[]): Promise<TeamBalanceResult> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const players = selectedPlayerIds
          .map((id) => mockPlayers.find((p) => p.id === id || p.name === id))
          .filter(Boolean) as Player[]

        // Calcul des scores des joueurs
        const playersWithScores = players.map((player) => ({
          ...player,
          calculatedScore: calculatePlayerScore(player),
        }))

        // Tri par score décroissant
        playersWithScores.sort((a, b) => b.calculatedScore - a.calculatedScore)

        // Algorithme d'équilibrage simple (alternance)
        const teamA: Player[] = []
        const teamB: Player[] = []

        playersWithScores.forEach((player, index) => {
          if (index % 2 === 0) {
            teamA.push(player)
          } else {
            teamB.push(player)
          }
        })

        // Calcul des moyennes
        const avgA = teamA.reduce((sum, p) => sum + p.calculatedScore, 0) / teamA.length
        const avgB = teamB.reduce((sum, p) => sum + p.calculatedScore, 0) / teamB.length

        // Calcul de la probabilité de victoire (basé sur la différence de score)
        const scoreDiff = avgA - avgB
        const pA = 1 / (1 + Math.exp(-scoreDiff * 10)) // Fonction sigmoïde

        const result: TeamBalanceResult = {
          teamA: teamA.map((p) => p.name),
          teamB: teamB.map((p) => p.name),
          avgA: teamA.reduce((sum, p) => sum + p.stats.winrate, 0) / teamA.length,
          avgB: teamB.reduce((sum, p) => sum + p.stats.winrate, 0) / teamB.length,
          pA,
          diff: Math.abs(avgA - avgB),
        }

        resolve(result)
      },
      1500 + Math.random() * 1000,
    ) // Simulation d'un délai d'API réaliste
  })
}

export function analyzeTeamBalance(teamData: TeamBalanceResult) {
  const diffPercent = Math.abs(teamData.diff) * 100

  let balanceQuality: "excellent" | "good" | "fair" | "poor"
  let balanceMessage: string

  if (diffPercent < 1.5) {
    balanceQuality = "excellent"
    balanceMessage = "Équilibrage excellent ! Les équipes sont très bien équilibrées."
  } else if (diffPercent < 3) {
    balanceQuality = "good"
    balanceMessage = "Bon équilibrage. Les équipes sont relativement équilibrées."
  } else if (diffPercent < 5) {
    balanceQuality = "fair"
    balanceMessage = "Équilibrage correct mais pourrait être amélioré."
  } else {
    balanceQuality = "poor"
    balanceMessage = "Équilibrage faible. Considérez une nouvelle répartition."
  }

  return {
    balanceQuality,
    balanceMessage,
    diffPercent,
    isBalanced: diffPercent < 3,
  }
}
