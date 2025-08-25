import { useEffect } from "react";

interface FlagProps {
  id: string;
  x: number;
  y: number;
  team: "blue" | "red";
  captured: boolean;
  players: Array<{
    id: number;
    x: number;
    y: number;
    team: "blue" | "red";
    isControlled: boolean;
  }>;
  onCapture: (flagId: string, capturingTeam: "blue" | "red") => void;
}

export const Flag = ({ id, x, y, team, captured, players, onCapture }: FlagProps) => {
  // Check for flag captures
  useEffect(() => {
    if (captured) return;
    
    const nearbyPlayers = players.filter(player => {
      const distance = Math.sqrt(
        Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2)
      );
      return distance < 25 && player.team !== team;
    });

    if (nearbyPlayers.length > 0) {
      const capturingPlayer = nearbyPlayers[0];
      onCapture(id, capturingPlayer.team);
    }
  }, [players, x, y, team, captured, id, onCapture]);

  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Flag base */}
      <div className={`w-3 h-8 ${
        team === "blue" ? "bg-team-blue/30" : "bg-team-red/30"
      } border border-current rounded-sm`} />
      
      {/* Flag cloth */}
      <div 
        className={`absolute top-0 left-3 w-8 h-6 ${
          team === "blue" 
            ? "bg-team-blue border-team-blue text-team-blue" 
            : "bg-team-red border-team-red text-team-red"
        } border rounded-r-sm ${
          captured ? "opacity-50" : "shadow-lg"
        } flex items-center justify-center text-xs font-bold`}
      >
        {team === "blue" ? "B" : "R"}
      </div>

      {/* Capture zone indicator */}
      <div className={`absolute inset-0 w-12 h-12 border border-dashed ${
        team === "blue" ? "border-team-blue/30" : "border-team-red/30"
      } rounded-full -translate-x-1/2 -translate-y-1/2`} />

      {/* Captured indicator */}
      {captured && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-primary font-bold animate-pulse">
          CAPTURED
        </div>
      )}
    </div>
  );
};