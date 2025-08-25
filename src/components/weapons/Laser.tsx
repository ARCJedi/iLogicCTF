interface LaserProps {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  ttl: number;
  maxTTL: number;
  team: "blue" | "red";
  isPrimary?: boolean;
}

export const Laser = ({ x, y, angle, ttl, maxTTL, team, isPrimary = true }: LaserProps) => {
  // Calculate laser length based on TTL (starts short, grows to max)
  const progress = (maxTTL - ttl) / maxTTL;
  const length = isPrimary ? Math.min(18, 3 + progress * 15) : 24; // Bouncy lasers are longer
  const width = 3;

  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${angle}rad)`,
      }}
    >
      <div
        className={`${
          team === "blue" ? "bg-team-blue" : "bg-team-red"
        } opacity-90`}
        style={{
          width: `${length}px`,
          height: `${width}px`,
          boxShadow: `0 0 6px ${team === "blue" ? "hsl(var(--team-blue))" : "hsl(var(--team-red))"}`,
        }}
      />
      {/* Laser glow effect */}
      <div
        className={`absolute top-0 left-0 ${
          team === "blue" ? "bg-team-blue" : "bg-team-red"
        } opacity-40`}
        style={{
          width: `${length}px`,
          height: `${width + 2}px`,
          marginTop: "-1px",
          boxShadow: `0 0 12px ${team === "blue" ? "hsl(var(--team-blue))" : "hsl(var(--team-red))"}`,
        }}
      />
    </div>
  );
};