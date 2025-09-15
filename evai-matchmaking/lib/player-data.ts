export interface Player {
  id: string
  name: string
  avatar?: string
  stats: {
    winrate: number
    kd: number
    avgDamage: number
    assists: number
    deathTime: number
    score: number
    playTime: number
  }
  rank: string
  team?: string
}

export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "SRDxNiko",
    avatar: "/gaming-avatar-neon.jpg",
    stats: {
      winrate: 0.75,
      kd: 2.3,
      avgDamage: 1850,
      assists: 12.5,
      deathTime: 8.2,
      score: 2450,
      playTime: 120,
    },
    rank: "Diamond",
    team: "SRD",
  },
  {
    id: "2",
    name: "SRxEny",
    avatar: "/gaming-avatar-cyber.jpg",
    stats: {
      winrate: 0.68,
      kd: 1.9,
      avgDamage: 1650,
      assists: 15.2,
      deathTime: 9.1,
      score: 2200,
      playTime: 95,
    },
    rank: "Platinum",
    team: "SR",
  },
  {
    id: "3",
    name: "SRxGeriko",
    avatar: "/gaming-avatar-futuristic.jpg",
    stats: {
      winrate: 0.72,
      kd: 2.1,
      avgDamage: 1750,
      assists: 11.8,
      deathTime: 7.9,
      score: 2350,
      playTime: 110,
    },
    rank: "Diamond",
    team: "SR",
  },
  {
    id: "4",
    name: "YKxNatinasss",
    avatar: "/gaming-avatar-blue-neon.jpg",
    stats: {
      winrate: 0.65,
      kd: 1.7,
      avgDamage: 1550,
      assists: 13.4,
      deathTime: 10.2,
      score: 2100,
      playTime: 85,
    },
    rank: "Gold",
    team: "YK",
  },
  {
    id: "5",
    name: "SRxAzWaK",
    avatar: "/gaming-avatar-orange-cyber.jpg",
    stats: {
      winrate: 0.7,
      kd: 2.0,
      avgDamage: 1700,
      assists: 14.1,
      deathTime: 8.5,
      score: 2300,
      playTime: 100,
    },
    rank: "Platinum",
    team: "SR",
  },
  {
    id: "6",
    name: "SRxMrCroustillant",
    avatar: "/gaming-avatar-green-neon.jpg",
    stats: {
      winrate: 0.63,
      kd: 1.6,
      avgDamage: 1450,
      assists: 16.2,
      deathTime: 11.1,
      score: 1950,
      playTime: 75,
    },
    rank: "Gold",
    team: "SR",
  },
  {
    id: "7",
    name: "SRxT4all",
    avatar: "/gaming-avatar-purple-cyber.jpg",
    stats: {
      winrate: 0.69,
      kd: 1.8,
      avgDamage: 1600,
      assists: 12.9,
      deathTime: 9.3,
      score: 2150,
      playTime: 90,
    },
    rank: "Platinum",
    team: "SR",
  },
  {
    id: "8",
    name: "YKxKiruaX",
    avatar: "/gaming-avatar-red-neon.jpg",
    stats: {
      winrate: 0.66,
      kd: 1.9,
      avgDamage: 1580,
      assists: 13.7,
      deathTime: 9.8,
      score: 2080,
      playTime: 88,
    },
    rank: "Gold",
    team: "YK",
  },
  {
    id: "9",
    name: "EVAxProGamer",
    avatar: "/gaming-avatar-black-neon.jpg",
    stats: {
      winrate: 0.74,
      kd: 2.2,
      avgDamage: 1800,
      assists: 11.5,
      deathTime: 8.0,
      score: 2400,
      playTime: 115,
    },
    rank: "Diamond",
    team: "EVA",
  },
  {
    id: "10",
    name: "VRxMaster",
    avatar: "/gaming-avatar-holographic.jpg",
    stats: {
      winrate: 0.61,
      kd: 1.5,
      avgDamage: 1400,
      assists: 17.1,
      deathTime: 12.0,
      score: 1900,
      playTime: 70,
    },
    rank: "Silver",
    team: "VR",
  },
  {
    id: "11",
    name: "CyberNinja",
    avatar: "/gaming-avatar-neon.jpg",
    stats: {
      winrate: 0.67,
      kd: 1.8,
      avgDamage: 1620,
      assists: 14.8,
      deathTime: 9.5,
      score: 2180,
      playTime: 92,
    },
    rank: "Platinum",
    team: "CYBER",
  },
  {
    id: "12",
    name: "QuantumGamer",
    avatar: "/gaming-avatar-cyber.jpg",
    stats: {
      winrate: 0.71,
      kd: 2.0,
      avgDamage: 1720,
      assists: 12.3,
      deathTime: 8.7,
      score: 2280,
      playTime: 105,
    },
    rank: "Diamond",
    team: "QUANTUM",
  },
]

export function calculatePlayerScore(player: Player): number {
  const { winrate, kd, avgDamage, assists } = player.stats
  return 0.4 * winrate + 0.3 * (kd / 3) + 0.2 * (avgDamage / 2000) + 0.1 * (assists / 20)
}

export function getRankColor(rank: string): string {
  switch (rank) {
    case "Diamond":
      return "text-blue-400"
    case "Platinum":
      return "text-gray-300"
    case "Gold":
      return "text-yellow-400"
    case "Silver":
      return "text-gray-400"
    default:
      return "text-gray-500"
  }
}

export function getRankBadgeColor(rank: string): string {
  switch (rank) {
    case "Diamond":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "Platinum":
      return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    case "Gold":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "Silver":
      return "bg-gray-400/20 text-gray-400 border-gray-400/30"
    default:
      return "bg-gray-600/20 text-gray-500 border-gray-600/30"
  }
}
