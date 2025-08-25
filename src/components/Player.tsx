interface PlayerProps {
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
}

export const Player = ({ x, y, team, isControlled, health, maxHealth, energy, maxEnergy, angle }: PlayerProps) => {
  return (
    <div
      className={`absolute w-6 h-6 rounded-full border-2 transition-all duration-100 ${
        team === "blue" 
          ? "bg-team-blue/80 border-team-blue team-blue" 
          : "bg-team-red/80 border-team-red team-red"
      } ${
        isControlled 
          ? "ring-2 ring-primary/50 scale-110" 
          : ""
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Player direction indicator */}
      <div 
        className={`absolute w-3 h-0.5 ${
          team === "blue" ? "bg-team-blue" : "bg-team-red"
        } top-1/2 -translate-y-1/2`}
        style={{
          transformOrigin: "left center",
          transform: `translateY(-50%) rotate(${angle}rad)`,
          left: "50%",
        }}
      />
      
      {/* Health bar */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8">
        <div className="h-1 bg-muted rounded-full">
          <div 
            className={`h-full rounded-full ${
              health > maxHealth * 0.5 ? "bg-primary" : 
              health > maxHealth * 0.25 ? "bg-secondary" : "bg-destructive"
            }`}
            style={{ width: `${(health / maxHealth) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Energy bar */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-8">
        <div className="h-1 bg-muted rounded-full">
          <div 
            className="h-full bg-accent rounded-full"
            style={{ width: `${(energy / maxEnergy) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Controlled player indicator */}
      {isControlled && (
        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 text-xs text-primary font-bold">
          YOU
        </div>
      )}
    </div>
  );
};