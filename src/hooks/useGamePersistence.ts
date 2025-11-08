import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'scrabble-game-state';
const STORAGE_VERSION = '1.0';

interface Player {
  id: number;
  name: string;
  score: number;
  customTimerMinutes?: number;
}

interface RoundScore {
  playerId: number;
  score: number;
  wasBingo: boolean;
}

export interface GameState {
  gameStarted: boolean;
  players: Player[];
  currentTurn: number;
  roundNumber: number;
  scoreHistory: RoundScore[][];
  currentRoundScores: RoundScore[];
}

interface StoredGameData {
  version: string;
  timestamp: number;
  gameData: GameState;
}

export const useGamePersistence = () => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveGameState = (state: GameState) => {
    // Only save if game is actually started
    if (!state.gameStarted) {
      return;
    }

    // Debounce saving to avoid too many writes
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        const dataToSave: StoredGameData = {
          version: STORAGE_VERSION,
          timestamp: Date.now(),
          gameData: state,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving game state:', error);
      }
    }, 500);
  };

  const loadGameState = (): GameState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed: StoredGameData = JSON.parse(saved);
      
      // Validate version
      if (parsed.version !== STORAGE_VERSION) {
        console.warn('Game state version mismatch, ignoring saved data');
        clearSavedGame();
        return null;
      }

      // Validate data structure
      if (!parsed.gameData || 
          !parsed.gameData.players || 
          !Array.isArray(parsed.gameData.players) ||
          parsed.gameData.players.length === 0) {
        console.warn('Invalid game state structure, ignoring saved data');
        clearSavedGame();
        return null;
      }

      return parsed.gameData;
    } catch (error) {
      console.error('Error loading game state:', error);
      clearSavedGame();
      return null;
    }
  };

  const clearSavedGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing game state:', error);
    }
  };

  const getSavedGameInfo = (): { players: string; round: number; timestamp: number } | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed: StoredGameData = JSON.parse(saved);
      if (!parsed.gameData) return null;

      return {
        players: parsed.gameData.players.map(p => p.name).join(', '),
        round: parsed.gameData.roundNumber,
        timestamp: parsed.timestamp,
      };
    } catch (error) {
      return null;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveGameState,
    loadGameState,
    clearSavedGame,
    getSavedGameInfo,
  };
};
