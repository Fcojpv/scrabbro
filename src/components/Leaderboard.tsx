import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface LeaderboardProps {
  players: Player[];
  onPositionChange?: () => void;
  roundNumber: number;
  onEditScore?: (playerId: number, newScore: number) => void;
}

// Emojis for different position changes
const HAPPY_EMOJIS = ["🎉", "🥳", "🌟", "✨", "🎊", "🏆", "💫", "🔥", "⭐", "🎯"];
const UPSET_EMOJIS = ["😮", "😯", "😲", "🤔", "😕", "😬", "😐", "😑", "🫤", "😶"];
const MAINTAIN_EMOJI = "😉";

export const Leaderboard = ({ players, onPositionChange, roundNumber, onEditScore }: LeaderboardProps) => {
  const [previousRankings, setPreviousRankings] = useState<number[]>([]);
  const [celebratingPlayers, setCelebratingPlayers] = useState<Set<number>>(new Set());
  const [playerEmojis, setPlayerEmojis] = useState<Map<number, string>>(new Map());
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editedScore, setEditedScore] = useState("");

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const leaderScore = sortedPlayers[0]?.score || 0;

  useEffect(() => {
    const currentRankings = sortedPlayers.map(p => p.id);
    
    if (previousRankings.length > 0) {
      const changed = currentRankings.some((id, idx) => previousRankings[idx] !== id);
      
      if (changed) {
        const improvedPlayers = new Set<number>();
        const newEmojis = new Map<number, string>();
        
        currentRankings.forEach((id, newRank) => {
          const oldRank = previousRankings.indexOf(id);
          
          if (oldRank !== -1) {
            if (oldRank > newRank) {
              // Player improved position - show happy emoji
              const randomHappyEmoji = HAPPY_EMOJIS[Math.floor(Math.random() * HAPPY_EMOJIS.length)];
              newEmojis.set(id, randomHappyEmoji);
              if (newRank < 3) {
                improvedPlayers.add(id);
              }
            } else if (oldRank < newRank) {
              // Player dropped position - show upset emoji
              const randomUpsetEmoji = UPSET_EMOJIS[Math.floor(Math.random() * UPSET_EMOJIS.length)];
              newEmojis.set(id, randomUpsetEmoji);
            } else {
              // Player maintained position - show wink emoji
              newEmojis.set(id, MAINTAIN_EMOJI);
            }
          }
        });

        setPlayerEmojis(newEmojis);
        
        if (improvedPlayers.size > 0) {
          setCelebratingPlayers(improvedPlayers);
          onPositionChange?.();
        }
        
        setTimeout(() => {
          setCelebratingPlayers(new Set());
          setPlayerEmojis(new Map());
        }, 5000);
      }
    }

    setPreviousRankings(currentRankings);
  }, [sortedPlayers.map(p => `${p.id}-${p.score}`).join(',')]);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getPositionColor = (rank: number) => {
    if (rank === 1) return "bg-gold/20 border-gold/40";
    if (rank === 2) return "bg-muted/50 border-muted";
    if (rank === 3) return "bg-accent/20 border-accent/40";
    return "bg-card border-border";
  };

  const calculateRankings = () => {
    const rankings: { player: Player; rank: number; displayIndex: number }[] = [];
    let currentRank = 1;
    
    sortedPlayers.forEach((player, index) => {
      if (index > 0 && player.score < sortedPlayers[index - 1].score) {
        currentRank = index + 1;
      }
      rankings.push({ player, rank: currentRank, displayIndex: index });
    });
    
    return rankings;
  };

  const rankedPlayers = calculateRankings();

  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
    setEditedScore(player.score.toString());
  };

  const handleSaveEdit = () => {
    if (editingPlayer && onEditScore) {
      const newScore = parseInt(editedScore) || 0;
      if (newScore >= 0) {
        onEditScore(editingPlayer.id, newScore);
        setEditingPlayer(null);
        setEditedScore("");
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-foreground mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Tabla de Posiciones</h2>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Ronda {roundNumber}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {rankedPlayers.map(({ player, rank, displayIndex }) => {
          const difference = leaderScore - player.score;
          const isCelebrating = celebratingPlayers.has(player.id);
          const playerEmoji = playerEmojis.get(player.id);

          return (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                layout: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
            >
              <Card
                className={`
                  p-4 border-2 transition-all relative overflow-hidden
                  ${getPositionColor(rank)}
                  ${isCelebrating ? "animate-pulse-subtle" : ""}
                `}
              >
            {isCelebrating && (
              <div className="absolute top-2 right-2 animate-celebrate text-2xl">
                🎉
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[60px]">
                  <span className="text-2xl font-bold text-foreground">
                    #{rank}
                  </span>
                  {getMedalEmoji(rank) && (
                    <span className="text-xl">{getMedalEmoji(rank)}</span>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span>{player.name}</span>
                    {playerEmoji && (
                      <motion.span 
                        className="text-lg"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {playerEmoji}
                      </motion.span>
                    )}
                  </div>
                  {difference > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>-{difference} del líder</span>
                    </div>
                  )}
                  {difference === 0 && displayIndex > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Empate con líder
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {player.score}
                  </div>
                  <div className="text-xs text-muted-foreground">puntos</div>
                </div>
                {onEditScore && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditClick(player)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <Dialog open={!!editingPlayer} onOpenChange={() => setEditingPlayer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar puntaje de {editingPlayer?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nuevo puntaje</label>
              <Input
                type="number"
                min="0"
                value={editedScore}
                onChange={(e) => setEditedScore(e.target.value)}
                className="text-2xl text-center font-bold"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlayer(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
