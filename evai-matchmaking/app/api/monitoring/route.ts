// app/api/simulate/route.ts
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { spawnSync } from "child_process"
import { mockPlayers, type Player } from "../../../lib/player-data"

export async function GET() {
  try {
    const logsPath = path.join(process.cwd(), "logs.json")
    const logsContent = fs.readFileSync(logsPath, "utf-8")
    const logs = JSON.parse(logsContent)
    return NextResponse.json(logs)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
