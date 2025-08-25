interface MissileProps {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  ttl: number;
  team: "blue" | "red";
}

export const Missile = ({ x, y, angle, team }: MissileProps) => {
  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${angle}rad)`,
      }}
    >
      {/* Missile body */}
      <div
        className={`${
          team === "blue" ? "bg-team-blue" : "bg-team-red"
        } rounded-full opacity-90`}
        style={{
          width: '8px',
          height: '3px',
          boxShadow: `0 0 8px ${team === "blue" ? "hsl(var(--team-blue))" : "hsl(var(--team-red))"}`,
        }}
      />
      {/* Missile trail */}
      <div
        className={`absolute top-0 right-0 ${
          team === "blue" ? "bg-team-blue" : "bg-team-red"
        } opacity-60`}
        style={{
          width: '12px',
          height: '1px',
          marginTop: '1px',
          marginRight: '8px',
          background: `linear-gradient(90deg, transparent, ${team === "blue" ? "hsl(var(--team-blue))" : "hsl(var(--team-red))"})`,
        }}
      />
    </div>
  );
};