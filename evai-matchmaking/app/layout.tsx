import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "EVAi MatchMaking & Ranking",
  description: "Système de matchmaking et ranking pour équilibrer des équipes EVA (VR en physique)",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <nav className="w-full bg-gray-900 text-white px-4 py-2 flex gap-4 items-center">
          <a href="/" className="font-bold hover:underline">Accueil</a>
          <a href="/ia-monitoring" className="hover:underline">Surveillance de l'IA</a>
        </nav>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
