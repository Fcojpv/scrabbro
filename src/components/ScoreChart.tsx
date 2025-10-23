import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface ScoreHistory {
  round: number;
  [key: string]: number; // player scores by id
}

interface ScoreChartProps {
  players: Player[];
  scoreHistory: ScoreHistory[];
}

const PLAYER_COLORS = [
  "hsl(220, 70%, 50%)",   // Blue
  "hsl(160, 60%, 45%)",   // Teal  
  "hsl(280, 60%, 60%)",   // Purple
  "hsl(35, 80%, 55%)",    // Orange
  "hsl(340, 70%, 55%)",   // Pink
  "hsl(90, 60%, 50%)",    // Lime
];

export const ScoreChart = ({ players, scoreHistory }: ScoreChartProps) => {
  if (scoreHistory.length === 0) {
    return (
      <Card className="p-8 bg-card/50 backdrop-blur">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">El gráfico se mostrará después de la primera ronda</p>
        </div>
      </Card>
    );
  }

  // Calculate max score to determine Y-axis scale
  const maxScore = Math.max(
    ...scoreHistory.flatMap(entry => 
      players.map(player => entry[`player_${player.id}`] || 0)
    )
  );

  // Determine Y-axis interval (25 if max <= 100, otherwise 50)
  const yAxisInterval = maxScore <= 100 ? 25 : 50;
  const yAxisMax = Math.ceil(maxScore / yAxisInterval) * yAxisInterval + yAxisInterval;

  // Custom legend renderer
  const renderLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {players.map((player, index) => (
          <div key={player.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: PLAYER_COLORS[index % PLAYER_COLORS.length] }}
            />
            <span className="text-xs text-foreground/80">{player.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-4 bg-card/50 backdrop-blur">
      {renderLegend()}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={scoreHistory}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))"
            opacity={0.3}
            vertical={false}
          />
          <XAxis 
            dataKey="round"
            tick={false}
            axisLine={{ stroke: "hsl(var(--border))", opacity: 0.3 }}
            tickLine={false}
          />
          <YAxis
            domain={[0, yAxisMax]}
            ticks={Array.from(
              { length: Math.floor(yAxisMax / yAxisInterval) + 1 }, 
              (_, i) => i * yAxisInterval
            )}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={{ stroke: "hsl(var(--border))", opacity: 0.3 }}
            tickLine={false}
          />
          {players.map((player, index) => (
            <Line
              key={player.id}
              type="monotone"
              dataKey={`player_${player.id}`}
              stroke={PLAYER_COLORS[index % PLAYER_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
