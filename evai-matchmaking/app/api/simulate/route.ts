// app/api/simulate/route.ts
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { spawnSync } from "child_process"
import { mockPlayers, type Player } from "../../../lib/player-data"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const selectedPlayerIds: string[] = body.selectedPlayerIds || []

    const players = selectedPlayerIds
      .map((id) => mockPlayers.find((p) => p.id === id || p.name === id))
      .filter(Boolean) as Player[]

    const playersJson = players.map((p) => ({
      Joueur: p.name,
      Score: p.stats.score,
      Tués: p.stats.kills,
      Assist: p.stats.assists,
      Morts: p.stats.deathTime,
      Dégâts: p.stats.damage,
      "temps mort %": p.stats.deathTime,
      "Temps total_s": p.stats.totalPlayTime,
      "Temps mort_s": p.stats.deadTime,
      "Matches": p.stats.matches,
    }))

    const playersFilePath = path.join(process.cwd(),"/public/scripts/playersJsonOutput.json")
    fs.writeFileSync(playersFilePath, JSON.stringify(playersJson, null, 2), "utf-8")

    const pythonPath = "python"
    const scriptPath = path.join(process.cwd(),"/public/scripts/main.py")
    const pythonResult = spawnSync(pythonPath, [scriptPath], { stdio: "inherit" })
    if (pythonResult.error) throw pythonResult.error

    const partitionFilePath = path.join(process.cwd(), "meilleure_partition.json")
    const partitionData = fs.readFileSync(partitionFilePath, "utf-8")
    const jsonFromFile = JSON.parse(partitionData)

    const teamA: Player[] = (jsonFromFile.teamA || [])
      .map((name: string) => mockPlayers.find((p) => p.name === name))
      .filter(Boolean) as Player[]
      console.log("Team A Players:", teamA)

    const teamB: Player[] = (jsonFromFile.teamB || [])
      .map((name: string) => mockPlayers.find((p) => p.name === name))
      .filter(Boolean) as Player[]
      console.log("Team B Players:", teamB)

    const result = {
      teamA: teamA.map((p) => p.name),
      teamB: teamB.map((p) => p.name),
      avgA: jsonFromFile.avgA ?? 0,
      avgB: jsonFromFile.avgB ?? 0,
      pA: jsonFromFile.pA ?? 0,
      diff: jsonFromFile.diff ?? 0,
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
