import { mockPlayers, type Player } from "./player-data"
import fs from "fs"
import path from "path"
import { spawnSync } from "child_process"


export interface TeamBalanceResult {
  teamA: string[]
  teamB: string[]
  avgA: number
  avgB: number
  pA: number
  diff: number
}

export async function simulateAPICall(selectedPlayerIds: string[]) {
  try {
    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedPlayerIds }),
    })

    if (!res.ok) {
      throw new Error(`Erreur API : ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    console.log("Résultat API :", data)
    return data
  } catch (err) {
    console.error("Erreur lors de l'appel à simulateAPICall :", err)
    return null
  }
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
