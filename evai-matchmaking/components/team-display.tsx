"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { mockPlayers, getRankBadgeColor, type Player } from "@/lib/player-data"
import { Users, Trophy, Zap, Target, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface TeamDisplayProps {
  teamData: {
    teamA: string[]
    teamB: string[]
    avgA: number
    avgB: number
    pA: number
    diff: number
  }
}

export function TeamDisplay({ teamData }: TeamDisplayProps) {
  const getPlayerById = (id: string): Player | undefined => {
    return mockPlayers.find((player) => player.name === id || player.id === id)
  }

  const teamAPlayers = teamData.teamA.map((id) => getPlayerById(id)).filter(Boolean) as Player[]
  console.log("Team A Players:", teamAPlayers)
  const teamBPlayers = teamData.teamB.map((id) => getPlayerById(id)).filter(Boolean) as Player[]
  console.log("Team B Players:", teamBPlayers)

  const getBalanceIcon = () => {
    const diffPercent = Math.abs(teamData.diff * 100)
    if (diffPercent < 1) return <Minus className="w-4 h-4 text-green-400" />
    if (diffPercent < 3) return <TrendingUp className="w-4 h-4 text-yellow-400" />
    return <TrendingDown className="w-4 h-4 text-red-400" />
  }

  const getBalanceColor = () => {
    const diffPercent = Math.abs(teamData.diff * 100)
    if (diffPercent < 1) return "text-green-400"
    if (diffPercent < 3) return "text-yellow-400"
    return "text-red-400"
  }

  const TeamCard = ({
    team,
    players,
    teamName,
    avgWinrate,
    winProbability,
    color,
  }: {
    team: string
    players: Player[]
    teamName: string
    avgWinrate: number
    winProbability: number
    color: string
  }) => (
    <Card className={`border-${color}/30 bg-card/50 backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`flex items-center justify-between text-${color}`}>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {teamName}
          </div>
          <Badge className={`bg-${color}/20 text-${color} border-${color}/30`}>4 joueurs</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Team Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className={`text-2xl font-bold text-${color}`}>{(avgWinrate * 100).toFixed(2)}%</div>
            <div className="text-xs text-muted-foreground">Winrate Moyen</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-${color}`}>{(winProbability * 100).toFixed(2)}%</div>
            <div className="text-xs text-muted-foreground">Prob. Victoire</div>
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-3">
          {players.map((player, index) => {
            const playerScore = player.stats.score
            return (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-10 h-10 border-2 border-primary/30">
                    <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                      {player.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">{player.name}</h4>
                      <Badge className={`text-xs ${getRankBadgeColor(player.rank)}`}>{player.rank}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {/* {(player.stats.winrate * 100).toFixed(0)}% */}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {/* {player.stats.kd.toFixed(1)} */}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {/* {player.stats.avgDamage} */}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold text-${color}`}>{playerScore.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Match Prediction */}
      <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Trophy className="w-5 h-5" />
            Prédiction du Match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <div className="text-2xl font-bold text-primary mb-1">{(teamData.pA * 100).toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Équipe A</div>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg border border-border/30 flex items-center justify-center">
              <div className="text-lg font-semibold text-muted-foreground">VS</div>
            </div>

            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
              <div className="text-2xl font-bold text-secondary mb-1">{((1 - teamData.pA) * 100).toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Équipe B</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Teams Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamCard
          team="A"
          players={teamAPlayers}
          teamName="Équipe A"
          avgWinrate={teamData.avgA}
          winProbability={teamData.pA}
          color="primary"
        />

        <TeamCard
          team="B"
          players={teamBPlayers}
          teamName="Équipe B"
          avgWinrate={teamData.avgB}
          winProbability={1 - teamData.pA}
          color="secondary"
        />
      </div>

    </div>
  )
}
