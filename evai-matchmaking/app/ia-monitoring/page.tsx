import React from "react";
import fs from "fs";
import path from "path";

interface LogEntry {
  timestamp: string;
  best_split: {
    pA: number;
    pB: number;
    diff: number;
  };
}

async function getLastLogs(): Promise<LogEntry[]> {
  const logsPath = path.join(process.cwd(), "logs.json");
  const logsRaw = fs.readFileSync(logsPath, "utf-8");
  let logs: LogEntry[] = [];
  try {
    if (logsRaw.trim().startsWith("{")) {
      // Fichier avec un seul objet JSON
      const obj = JSON.parse(logsRaw);
      logs = [obj];
    } else {
      // Fichier avec plusieurs lignes JSON
      logs = logsRaw
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));
    }
  } catch (e) {
    logs = [];
  }
  return logs.slice(-10).reverse();
}

export default async function IAMonitoringPage() {
  const logs = await getLastLogs();
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-[var(--primary)] drop-shadow-neon">Surveillance de l'IA</h1>
      <div className="w-full max-w-2xl rounded-xl shadow-lg bg-[var(--card)] border border-[var(--border)] overflow-hidden">
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
              const diffPercent = Math.abs(log.best_split.diff * 100);
              let diffColor = "bg-[var(--accent)]";
              if (diffPercent < 0.01) diffColor = "bg-green-500";
              else if (diffPercent < 0.1) diffColor = "bg-yellow-500";
              else diffColor = "bg-red-500";
              return (
                <tr key={idx} className={idx % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--popover)]"}>
                  <td className="py-2 px-2 font-mono text-xs text-[var(--muted-foreground)]">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-2 px-2">
                    <span className="px-2 py-1 rounded-lg font-bold bg-[var(--chart-1)] text-black shadow-neon">
                      {(log.best_split.pA * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className="px-2 py-1 rounded-lg font-bold bg-[var(--chart-2)] text-black shadow-neon">
                      {(log.best_split.pB * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded-lg font-bold text-white shadow-neon ${diffColor}`}>
                      {diffPercent.toExponential(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
