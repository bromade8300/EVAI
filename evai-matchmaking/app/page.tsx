"use client"

import { useState } from "react"
import { PlayerSelection } from "@/components/player-selection"
import { TeamDisplay } from "@/components/team-display"
import { StatsVisualization } from "@/components/stats-visualization"
import { ExportFeatures } from "@/components/export-features"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { simulateAPICall, analyzeTeamBalance, type TeamBalanceResult } from "@/lib/team-balancing"
import { Zap, Users, BarChart3, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function HomePage() {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [teamData, setTeamData] = useState<TeamBalanceResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const getBalanceIcon = () => {
    const diffPercent = Math.abs(teamData.diff * 100)
    if (diffPercent < 1) return <Minus className="w-4 h-4 text-green-400" />
    if (diffPercent < 3) return <TrendingUp className="w-4 h-4 text-yellow-400" />
    return <TrendingDown className="w-4 h-4 text-red-400" />
  }
  const handleGenerateTeams = async () => {
    if (selectedPlayers.length !== 8) {
      alert("Veuillez sélectionner exactement 8 joueurs")
      return
    }

    setIsGenerating(true)

    try {
      const result = await simulateAPICall(selectedPlayers)
      setTeamData(result)
    } catch (error) {
      console.error("Erreur lors de la génération des équipes:", error)
      alert("Erreur lors de la génération des équipes. Veuillez réessayer.")
    } finally {
      setIsGenerating(false)
    }
  }

  const balanceAnalysis = teamData ? analyzeTeamBalance(teamData) : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EVAi MatchMaking & Ranking
              </h1>
              <p className="text-muted-foreground">
                Système de matchmaking et ranking pour équilibrer des équipes EVA (VR en physique)
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Joueurs Sélectionnés</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{selectedPlayers.length}/8</div>
              <p className="text-xs text-muted-foreground">Sélectionnez 8 joueurs pour générer les équipes</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équilibrage</CardTitle>
              <BarChart3 className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {balanceAnalysis ? `${teamData?.diff.toFixed(2)}%` : "--"}
              </div>
              <p className="text-xs text-muted-foreground">Différence entre les équipes (objectif ~0%)</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Statut</CardTitle>
              <Zap className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{teamData ? "Prêt" : "En attente"}</div>
              <p className="text-xs text-muted-foreground">
                {teamData ? "Équipes générées avec succès" : "Sélectionnez des joueurs"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Player Selection */}
        <PlayerSelection selectedPlayers={selectedPlayers} onSelectionChange={setSelectedPlayers} />

        {/* Generate Teams Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateTeams}
            disabled={selectedPlayers.length !== 8 || isGenerating}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8 py-3 neon-glow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              "Générer les Équipes"
            )}
          </Button>
        </div>

        {/* Balance Analysis */}
        {balanceAnalysis && (
          <Card
            className={`border-${balanceAnalysis.balanceQuality === "excellent" ? "green" : balanceAnalysis.balanceQuality === "good" ? "yellow" : "red"}-500/20 bg-card/50 backdrop-blur-sm`}
          >
            <CardHeader>
                <CardTitle className="text-center flex items-center gap-2">{getBalanceIcon()} Analyse de l'Équilibrage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div
                  className={`text-lg font-semibold mb-2 ${
                    balanceAnalysis.balanceQuality === "excellent"
                      ? "text-green-400"
                      : balanceAnalysis.balanceQuality === "good"
                        ? "text-yellow-400"
                        : balanceAnalysis.balanceQuality === "fair"
                          ? "text-orange-400"
                          : "text-red-400"
                  }`}
                >
                  {balanceAnalysis.balanceMessage}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Display */}
        {teamData && (
          <>
            <TeamDisplay teamData={teamData} />
            <StatsVisualization teamData={teamData} />
            <ExportFeatures teamData={teamData} />
          </>
        )}
      </main>
    </div>
  )
}
