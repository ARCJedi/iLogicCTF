import { useEffect, useRef, useState } from "react";
import { Player } from "./Player";
import { Flag } from "./Flag";
import { GameUI } from "./GameUI";

export const GameField = () => {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [players, setPlayers] = useState<Array<{
    id: number;
    x: number;
    y: number;
    team: "blue" | "red";
    isControlled: boolean;
  }>>([
    { id: 1, x: 100, y: 300, team: "blue" as const, isControlled: true },
    { id: 2, x: 200, y: 250, team: "blue" as const, isControlled: false },
    { id: 3, x: 700, y: 300, team: "red" as const, isControlled: false },
    { id: 4, x: 600, y: 350, team: "red" as const, isControlled: false },
  ]);
  
  const [flags, setFlags] = useState<Array<{
    id: string;
    x: number;
    y: number;
    team: "blue" | "red";
    captured: boolean;
  }>>([
    { id: "blue", x: 50, y: 275, team: "blue" as const, captured: false },
    { id: "red", x: 750, y: 275, team: "red" as const, captured: false },
  ]);

  const [gameState, setGameState] = useState({
    blueScore: 0,
    redScore: 0,
    gameTime: 300, // 5 minutes
    isPaused: false,
  });

  // Handle WASD movement for controlled player
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.isPaused) return;
      
      setPlayers(prev => prev.map(player => {
        if (!player.isControlled) return player;
        
        const speed = 3;
        let newX = player.x;
        let newY = player.y;
        
        switch(e.key.toLowerCase()) {
          case 'w': newY = Math.max(10, player.y - speed); break;
          case 'a': newX = Math.max(10, player.x - speed); break;
          case 's': newY = Math.min(540, player.y + speed); break;
          case 'd': newX = Math.min(790, player.x + speed); break;
          default: return player;
        }
        
        return { ...player, x: newX, y: newY };
      }));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPaused]);

  // Game timer
  useEffect(() => {
    if (gameState.isPaused || gameState.gameTime <= 0) return;
    
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        gameTime: Math.max(0, prev.gameTime - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isPaused, gameState.gameTime]);

  const handleFlagCapture = (flagId: string, capturingTeam: "blue" | "red") => {
    setFlags(prev => prev.map(flag => 
      flag.id === flagId 
        ? { ...flag, captured: true, team: capturingTeam }
        : flag
    ));
    
    setGameState(prev => ({
      ...prev,
      [capturingTeam === 'blue' ? 'blueScore' : 'redScore']: 
        prev[capturingTeam === 'blue' ? 'blueScore' : 'redScore'] + 1
    }));
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <GameUI 
        gameState={gameState} 
        onTogglePause={togglePause}
      />
      
      <div 
        ref={fieldRef}
        className="game-field game-grid w-full h-full absolute inset-0"
      >
        {/* Field boundaries and zones */}
        <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform -translate-x-0.5" />
          
          {/* Team zones */}
          <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-team-blue/10 border-r border-team-blue/30 rounded-l-lg" />
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-team-red/10 border-l border-team-red/30 rounded-r-lg" />
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-accent/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Render flags */}
        {flags.map(flag => (
          <Flag 
            key={flag.id}
            {...flag}
            players={players}
            onCapture={handleFlagCapture}
          />
        ))}

        {/* Render players */}
        {players.map(player => (
          <Player 
            key={player.id}
            {...player}
          />
        ))}

        {/* Game over overlay */}
        {gameState.gameTime === 0 && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="retro-panel p-8 text-center">
              <h2 className="text-4xl font-bold text-primary mb-4">GAME OVER</h2>
              <div className="text-2xl mb-4">
                {gameState.blueScore > gameState.redScore ? (
                  <span className="text-team-blue">BLUE TEAM WINS!</span>
                ) : gameState.redScore > gameState.blueScore ? (
                  <span className="text-team-red">RED TEAM WINS!</span>
                ) : (
                  <span className="text-accent">DRAW!</span>
                )}
              </div>
              <div className="text-lg text-muted-foreground">
                Final Score: {gameState.blueScore} - {gameState.redScore}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};