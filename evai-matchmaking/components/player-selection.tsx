"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockPlayers, calculatePlayerScore, getRankBadgeColor, type Player } from "@/lib/player-data"
import { Search, Users, Zap, Target, Clock, Trophy } from "lucide-react"

interface PlayerSelectionProps {
  selectedPlayers: string[]
  onSelectionChange: (players: string[]) => void
}

export function PlayerSelection({ selectedPlayers, onSelectionChange }: PlayerSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [players] = useState<Player[]>(mockPlayers)

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.rank.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      onSelectionChange(selectedPlayers.filter((id) => id !== playerId))
    } else if (selectedPlayers.length < 8) {
      onSelectionChange([...selectedPlayers, playerId])
    }
  }

  const clearSelection = () => {
    onSelectionChange([])
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Sélection des Joueurs
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                {selectedPlayers.length}/8 sélectionnés
              </Badge>
              {selectedPlayers.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Effacer
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, équipe ou rang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input/50 border-border/50"
            />
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayers.includes(player.id)
              const playerScore = calculatePlayerScore(player)

              return (
                <Card
                  key={player.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-lg neon-glow"
                      : "border-border/50 bg-card/30 hover:border-primary/50"
                  } ${selectedPlayers.length >= 8 && !isSelected ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => togglePlayerSelection(player.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12 border-2 border-primary/30">
                        <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {player.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{player.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getRankBadgeColor(player.rank)}`}>{player.rank}</Badge>
                          {player.team && (
                            <Badge variant="outline" className="text-xs">
                              {player.team}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Trophy className="w-3 h-3" />
                          Winrate
                        </span>
                        <span className="font-semibold text-secondary">{(player.stats.winrate * 100).toFixed(0)}%</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Zap className="w-3 h-3" />
                          K/D
                        </span>
                        <span className="font-semibold text-accent">{player.stats.kd.toFixed(1)}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Target className="w-3 h-3" />
                          Dégâts
                        </span>
                        <span className="font-semibold text-primary">{player.stats.avgDamage}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Score
                        </span>
                        <span className="font-semibold text-chart-5">{playerScore.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="mt-3 text-center">
                        <Badge className="bg-primary text-primary-foreground">Sélectionné</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun joueur trouvé pour "{searchTerm}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
