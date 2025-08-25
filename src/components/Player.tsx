interface PlayerProps {
  id: number;
  x: number;
  y: number;
  team: "blue" | "red";
  isControlled: boolean;
}

export const Player = ({ x, y, team, isControlled }: PlayerProps) => {
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
      <div className={`absolute w-2 h-0.5 ${
        team === "blue" ? "bg-team-blue" : "bg-team-red"
      } top-1/2 -translate-y-1/2 right-0 translate-x-full`} />
      
      {/* Controlled player indicator */}
      {isControlled && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs text-primary font-bold">
          YOU
        </div>
      )}
    </div>
  );
};