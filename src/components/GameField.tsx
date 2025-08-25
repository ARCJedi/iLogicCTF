import { useEffect, useRef, useState, useCallback } from "react";
import { Player } from "./Player";
import { Flag } from "./Flag";
import { GameUI } from "./GameUI";
import { useWeaponSystem, WeaponType } from "../hooks/useWeaponSystem";
import { Laser } from "./weapons/Laser";
import { Missile } from "./weapons/Missile";
import { Grenade } from "./weapons/Grenade";
import { Shrapnel } from "./weapons/Shrapnel";

export const GameField = () => {
  const fieldRef = useRef<HTMLDivElement>(null);
  const { selectedWeapon, projectiles, fireWeapon, cycleWeapon } = useWeaponSystem();
  const [players, setPlayers] = useState<Array<{
    id: number;
    x: number;
    y: number;
    team: "blue" | "red";
    isControlled: boolean;
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    angle: number;
  }>>([
    { id: 1, x: 100, y: 300, team: "blue" as const, isControlled: true, health: 224, maxHealth: 224, energy: 57, maxEnergy: 57, angle: 0 },
    { id: 2, x: 200, y: 250, team: "blue" as const, isControlled: false, health: 224, maxHealth: 224, energy: 57, maxEnergy: 57, angle: 0 },
    { id: 3, x: 700, y: 300, team: "red" as const, isControlled: false, health: 224, maxHealth: 224, energy: 57, maxEnergy: 57, angle: Math.PI },
    { id: 4, x: 600, y: 350, team: "red" as const, isControlled: false, health: 224, maxHealth: 224, energy: 57, maxEnergy: 57, angle: Math.PI },
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

  // Handle mouse and weapon firing
  const handleMouseClick = useCallback((e: MouseEvent) => {
    if (gameState.isPaused) return;
    
    const controlledPlayer = players.find(p => p.isControlled);
    if (!controlledPlayer || controlledPlayer.energy < 12) return;
    
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const angle = Math.atan2(mouseY - controlledPlayer.y, mouseX - controlledPlayer.x);
    
    if (e.button === 0) { // Left click - primary laser
      fireWeapon("laser", controlledPlayer.x, controlledPlayer.y, angle, controlledPlayer.team);
      
      // Update player energy and angle
      setPlayers(prev => prev.map(p => 
        p.isControlled 
          ? { ...p, energy: Math.max(0, p.energy - 12), angle }
          : p
      ));
    }
  }, [gameState.isPaused, players, fireWeapon]);

  // Handle WASD movement and weapon selection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.isPaused) return;
      
      const controlledPlayer = players.find(p => p.isControlled);
      if (!controlledPlayer) return;
      
      // Weapon selection
      if (e.key === 'Shift') {
        cycleWeapon("next");
        return;
      }
      
      // Movement
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

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cycleWeapon(e.deltaY > 0 ? "next" : "prev");
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousedown', handleMouseClick);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousedown', handleMouseClick);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [gameState.isPaused, players, handleMouseClick, cycleWeapon]);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => prev.map(player => ({
        ...player,
        energy: Math.min(player.maxEnergy, player.energy + 1)
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
        selectedWeapon={selectedWeapon}
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

        {/* Render projectiles */}
        {projectiles.map(projectile => {
          switch (projectile.type) {
            case "laser":
            case "bouncy":
              return (
                <Laser
                  key={projectile.id}
                  {...projectile}
                  isPrimary={projectile.type === "laser"}
                />
              );
            case "missile":
              return <Missile key={projectile.id} {...projectile} />;
            case "grenade":
              return <Grenade key={projectile.id} {...projectile} />;
            case "shrapnel":
              return <Shrapnel key={projectile.id} {...projectile} />;
            default:
              return null;
          }
        })}

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