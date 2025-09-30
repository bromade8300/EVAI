"use client";
import React, { useEffect, useState } from "react";

interface LogEntry {
  timestamp: string;
  results: {
    pA: number;
    pB: number;
    diff: number;
  };
}

export default function IAMonitoringPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/monitoring")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data.slice(-10).reverse());
        } else {
          setLogs([data]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des logs");
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-[var(--primary)]">Surveillance de l'IA</h1>
      <div className="w-full max-w-2xl rounded-xl shadow-lg bg-[var(--card)] border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-lg">Chargement des logs...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[var(--primary)] text-[var(--primary-foreground)]">
              <tr>
                <th className="py-3 px-2 text-left">Date</th>
                <th className="py-3 px-2 text-left">Prob. Victoire A</th>
                <th className="py-3 px-2 text-left">Prob. Victoire B</th>
                <th className="py-3 px-2 text-left">Différence</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => {
                const diffPercent = Math.abs(log.results.diff * 100);
                let diffColor = "bg-[var(--accent)]";
                if (diffPercent > 15) diffColor = "bg-red-500";
                else diffColor = "bg-green-500";

                // Formatage du pourcentage : 4 décimales si < 0.01, sinon 2 décimales
                let diffDisplay = "";
                if (diffPercent < 0.01) {
                  diffDisplay = diffPercent.toFixed(4) + "%";
                } else {
                  diffDisplay = diffPercent.toFixed(2) + "%";
                }

                return (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--popover)]"}>
                    <td className="py-2 px-2 font-mono text-xs text-[var(--muted-foreground)]">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-2">
                      <span className="px-2 py-1 rounded-lg font-bold bg-[var(--chart-1)] text-black shadow-neon">
                        {(log.results.pA * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="px-2 py-1 rounded-lg font-bold bg-[var(--chart-2)] text-black shadow-neon">
                        {(log.results.pB * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded-lg font-bold text-white shadow-neon ${diffColor}`}>
                        {diffDisplay}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <style>{`
        .shadow-neon {
          box-shadow: 0 0 8px var(--primary), 0 0 2px var(--accent);
        }
        .drop-shadow-neon {
          text-shadow: 0 0 8px var(--primary), 0 0 2px var(--accent);
        }
      `}</style>
    </main>
  );
}
