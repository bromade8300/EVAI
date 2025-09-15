export interface Player {
  id: string
  name: string
  avatar?: string
  stats: {
    score: number
    kills: number
    assists: number
    deaths: number
    damage: number
    deathTime: number
    totalPlayTime: number
    deadTime: number
    matches: number
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
      score: 2450,
      kills: 120,
      assists: 12.5,
      deaths: 50, // This is an assumption as there is no deaths field in the JSON file but it's important to keep
      damage: 1850,
      deathTime: 8.2,
      totalPlayTime: 120,
      deadTime: 120 * 0.2, // This is an assumption based on the "temps mort %" which is not available in the original file, you will need to manually set the values from the JSON
      matches: 10, // This is an assumption as there is no matches field in the original file, you will need to manually set the values from the JSON
    },
    rank: "Diamond",
    team: "SRD",
  },
  {
    id: "2",
    name: "SRxEny",
    avatar: "/gaming-avatar-cyber.jpg",
    stats: {
      score: 2200,
      kills: 90,
      assists: 15.2,
      deaths: 45,
      damage: 1650,
      deathTime: 9.1,
      totalPlayTime: 95,
      deadTime: 95 * 0.18,
      matches: 8,
    },
    rank: "Platinum",
    team: "SR",
  },
  {
    id: "3",
    name: "SRxGeriko",
    avatar: "/gaming-avatar-futuristic.jpg",
    stats: {
      score: 2350,
      kills: 110,
      assists: 11.8,
      deaths: 52,
      damage: 1750,
      deathTime: 7.9,
      totalPlayTime: 110,
      deadTime: 110 * 0.2,
      matches: 9,
    },
    rank: "Diamond",
    team: "SR",
  },
  {
    id: "4",
    name: "YKxNatinasss",
    avatar: "/gaming-avatar-blue-neon.jpg",
    stats: {
      score: 2100,
      kills: 80,
      assists: 13.4,
      deaths: 55,
      damage: 1550,
      deathTime: 10.2,
      totalPlayTime: 85,
      deadTime: 85 * 0.2,
      matches: 7,
    },
    rank: "Gold",
    team: "YK",
  },
  {
    id: "5",
    name: "SRxAzWaK",
    avatar: "/gaming-avatar-orange-cyber.jpg",
    stats: {
      score: 2300,
      kills: 105,
      assists: 14.1,
      deaths: 48,
      damage: 1700,
      deathTime: 8.5,
      totalPlayTime: 100,
      deadTime: 100 * 0.19,
      matches: 9,
    },
    rank: "Platinum",
    team: "SR",
  },
  {
    id: "6",
    name: "SRxMrCroustillant",
    avatar: "/gaming-avatar-green-neon.jpg",
    stats: {
      score: 1950,
      kills: 70,
      assists: 16.2,
      deaths: 60,
      damage: 1450,
      deathTime: 11.1,
      totalPlayTime: 75,
      deadTime: 75 * 0.23,
      matches: 6,
    },
    rank: "Gold",
    team: "SR",
  },
  {
    id: "7",
    name: "SRxT4all",
    avatar: "/gaming-avatar-purple-cyber.jpg",
    stats: {
      score: 2150,
      kills: 95,
      assists: 12.9,
      deaths: 51,
      damage: 1600,
      deathTime: 9.3,
      totalPlayTime: 90,
      deadTime: 90 * 0.21,
      matches: 8,
    },
    rank: "Platinum",
    team: "SR",
  },
  {
    id: "8",
    name: "YKxKiruaX",
    avatar: "/gaming-avatar-red-neon.jpg",
    stats: {
      score: 2080,
      kills: 88,
      assists: 13.7,
      deaths: 53,
      damage: 1580,
      deathTime: 9.8,
      totalPlayTime: 88,
      deadTime: 88 * 0.2,
      matches: 7,
    },
    rank: "Gold",
    team: "YK",
  },
  {
    id: "9",
    name: "EVAxProGamer",
    avatar: "/gaming-avatar-black-neon.jpg",
    stats: {
      score: 2400,
      kills: 115,
      assists: 11.5,
      deaths: 49,
      damage: 1800,
      deathTime: 8.0,
      totalPlayTime: 115,
      deadTime: 115 * 0.17,
      matches: 10,
    },
    rank: "Diamond",
    team: "EVA",
  },
  {
    id: "10",
    name: "VRxMaster",
    avatar: "/gaming-avatar-holographic.jpg",
    stats: {
      score: 1900,
      kills: 65,
      assists: 17.1,
      deaths: 62,
      damage: 1400,
      deathTime: 12.0,
      totalPlayTime: 70,
      deadTime: 70 * 0.25,
      matches: 6,
    },
    rank: "Silver",
    team: "VR",
  },
  {
    id: "11",
    name: "CyberNinja",
    avatar: "/gaming-avatar-neon.jpg",
    stats: {
      score: 2180,
      kills: 20,
      assists: 14.8,
      deaths: 54,
      damage: 1620,
      deathTime: 9.5,
      totalPlayTime: 92,
      deadTime: 92 * 0.22,
      matches: 8,
    },
    rank: "Platinum",
    team: "CYBER",
  },
  {
    id: "12",
    name: "QuantumGamer",
    avatar: "/gaming-avatar-cyber.jpg",
    stats: {
      score: 2280,
      kills: 108,
      assists: 12.3,
      deaths: 47,
      damage: 1720,
      deathTime: 8.7,
      totalPlayTime: 105,
      deadTime: 105 * 0.18,
      matches: 9,
    },
    rank: "Diamond",
    team: "QUANTUM",
  },
]

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
