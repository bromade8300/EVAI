"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockPlayers, calculatePlayerScore, type Player } from "@/lib/player-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { BarChart3, TrendingUp, Users } from "lucide-react"

interface StatsVisualizationProps {
  teamData: {
    teamA: string[]
    teamB: string[]
    avgA: number
    avgB: number
    pA: number
    diff: number
  }
}

export function StatsVisualization({ teamData }: StatsVisualizationProps) {
  const getPlayerById = (id: string): Player | undefined => {
    return mockPlayers.find((player) => player.name === id || player.id === id)
  }

  const teamAPlayers = teamData.teamA.map((id) => getPlayerById(id)).filter(Boolean) as Player[]
  const teamBPlayers = teamData.teamB.map((id) => getPlayerById(id)).filter(Boolean) as Player[]

  // Données pour le graphique en barres comparatif
  const comparisonData = [
    {
      metric: "Winrate",
      "Équipe A": (teamAPlayers.reduce((sum, p) => sum + p.stats.winrate, 0) / teamAPlayers.length) * 100,
      "Équipe B": (teamBPlayers.reduce((sum, p) => sum + p.stats.winrate, 0) / teamBPlayers.length) * 100,
    },
    {
      metric: "K/D Ratio",
      "Équipe A": teamAPlayers.reduce((sum, p) => sum + p.stats.kd, 0) / teamAPlayers.length,
      "Équipe B": teamBPlayers.reduce((sum, p) => sum + p.stats.kd, 0) / teamBPlayers.length,
    },
    {
      metric: "Dégâts Moy.",
      "Équipe A": teamAPlayers.reduce((sum, p) => sum + p.stats.avgDamage, 0) / teamAPlayers.length,
      "Équipe B": teamBPlayers.reduce((sum, p) => sum + p.stats.avgDamage, 0) / teamBPlayers.length,
    },
    {
      metric: "Assists",
      "Équipe A": teamAPlayers.reduce((sum, p) => sum + p.stats.assists, 0) / teamAPlayers.length,
      "Équipe B": teamBPlayers.reduce((sum, p) => sum + p.stats.assists, 0) / teamBPlayers.length,
    },
    {
      metric: "Score Global",
      "Équipe A": (teamAPlayers.reduce((sum, p) => sum + calculatePlayerScore(p), 0) / teamAPlayers.length) * 100,
      "Équipe B": (teamBPlayers.reduce((sum, p) => sum + calculatePlayerScore(p), 0) / teamBPlayers.length) * 100,
    },
  ]

  // Données pour le radar chart
  const radarData = [
    {
      metric: "Winrate",
      "Équipe A": (teamAPlayers.reduce((sum, p) => sum + p.stats.winrate, 0) / teamAPlayers.length) * 100,
      "Équipe B": (teamBPlayers.reduce((sum, p) => sum + p.stats.winrate, 0) / teamBPlayers.length) * 100,
      fullMark: 100,
    },
    {
      metric: "K/D",
      "Équipe A": (teamAPlayers.reduce((sum, p) => sum + p.stats.kd, 0) / teamAPlayers.length) * 20,
      "Équipe B": (teamBPlayers.reduce((sum, p) => sum + p.stats.kd, 0) / teamBPlayers.length) * 20,
      fullMark: 100,
    },
    {
      metric: "Dégâts",
      "Équipe A": teamAPlayers.reduce((sum, p) => sum + p.stats.avgDamage, 0) / teamAPlayers.length / 20,
      "Équipe B": teamBPlayers.reduce((sum, p) => sum + p.stats.avgDamage, 0) / teamBPlayers.length / 20,
      fullMark: 100,
    },
    {
      metric: "Assists",
      "Équipe A": (teamAPlayers.reduce((sum, p) => sum + p.stats.assists, 0) / teamAPlayers.length) * 5,
      "Équipe B": (teamBPlayers.reduce((sum, p) => sum + p.stats.assists, 0) / teamBPlayers.length) * 5,
      fullMark: 100,
    },
    {
      metric: "Temps Survie",
      "Équipe A": Math.max(
        0,
        100 - (teamAPlayers.reduce((sum, p) => sum + p.stats.deathTime, 0) / teamAPlayers.length) * 8,
      ),
      "Équipe B": Math.max(
        0,
        100 - (teamBPlayers.reduce((sum, p) => sum + p.stats.deathTime, 0) / teamBPlayers.length) * 8,
      ),
      fullMark: 100,
    },
  ]

  // Données pour le graphique de performance individuelle
  const individualPerformanceData = [
    ...teamAPlayers.map((player) => ({
      name: player.name.length > 10 ? player.name.substring(0, 10) + "..." : player.name,
      score: calculatePlayerScore(player) * 100,
      team: "A",
      winrate: player.stats.winrate * 100,
      kd: player.stats.kd,
    })),
    ...teamBPlayers.map((player) => ({
      name: player.name.length > 10 ? player.name.substring(0, 10) + "..." : player.name,
      score: calculatePlayerScore(player) * 100,
      team: "B",
      winrate: player.stats.winrate * 100,
      kd: player.stats.kd,
    })),
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Analyse des corrélations */}
      <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <TrendingUp className="w-5 h-5" />
            Analyse des Corrélations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {(
                    comparisonData.find((d) => d.metric === "K/D Ratio")?.[
                      teamData.pA > 0.5 ? "Équipe A" : "Équipe B"
                    ] || 0
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">K/D Moyen</div>
              </div>
            </div>

            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {(
                    comparisonData.find((d) => d.metric === "Dégâts Moy.")?.[
                      teamData.pA > 0.5 ? "Équipe A" : "Équipe B"
                    ] || 0
                  ).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Dégâts Moyens</div>
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {(
                    comparisonData.find((d) => d.metric === "Assists")?.[teamData.pA > 0.5 ? "Équipe A" : "Équipe B"] ||
                    0
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Assists Moyennes</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-semibold mb-2">Facteurs Clés de Performance</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • <strong>K/D Ratio</strong>: Corrélation forte avec le winrate (coefficient: 0.3)
              </p>
              <p>
                • <strong>Dégâts moyens</strong>: Impact modéré sur la performance (coefficient: 0.2)
              </p>
              <p>
                • <strong>Assists</strong>: Indicateur de jeu d'équipe (coefficient: 0.1)
              </p>
              <p>
                • <strong>Winrate global</strong>: Facteur principal d'équilibrage (coefficient: 0.4)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
