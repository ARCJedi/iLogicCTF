import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WeaponType } from "../hooks/useWeaponSystem";

interface GameState {
  blueScore: number;
  redScore: number;
  gameTime: number;
  isPaused: boolean;
}

interface GameUIProps {
  gameState: GameState;
  onTogglePause: () => void;
  selectedWeapon?: WeaponType;
}

export const GameUI = ({ gameState, onTogglePause, selectedWeapon = "laser" }: GameUIProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <Card className="retro-panel px-6 py-3 flex items-center gap-6">
        {/* Blue Team Score */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Blue Team</div>
          <div className="text-2xl font-bold text-team-blue">{gameState.blueScore}</div>
        </div>

        {/* Game Timer */}
        <div className="text-center px-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Time</div>
          <div className={`text-2xl font-bold ${
            gameState.gameTime < 30 ? 'text-destructive animate-pulse' : 'text-primary'
          }`}>
            {formatTime(gameState.gameTime)}
          </div>
        </div>

        {/* Red Team Score */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Red Team</div>
          <div className="text-2xl font-bold text-team-red">{gameState.redScore}</div>
        </div>

        {/* Pause Button */}
        <Button 
          variant="outline"
          size="sm"
          onClick={onTogglePause}
          className="ml-4 neon-glow"
        >
          {gameState.isPaused ? 'RESUME' : 'PAUSE'}
        </Button>
      </Card>

      {/* Weapon selection */}
      <Card className="retro-panel mt-2 px-4 py-2 text-xs text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-muted-foreground">Weapon:</span>
          <span className={`font-bold uppercase ${
            selectedWeapon === "laser" ? "text-primary" :
            selectedWeapon === "bouncy" ? "text-secondary" :
            selectedWeapon === "missile" ? "text-destructive" :
            "text-accent"
          }`}>
            {selectedWeapon}
          </span>
        </div>
        <div className="text-muted-foreground">
          WASD: Move • Left Click: Fire • Scroll/Shift: Change Weapon
        </div>
      </Card>
    </div>
  );
};