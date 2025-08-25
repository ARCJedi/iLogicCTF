interface GrenadeProps {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  ttl: number;
  team: "blue" | "red";
}

export const Grenade = ({ x, y, team }: GrenadeProps) => {
  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Grenade body */}
      <div
        className={`${
          team === "blue" ? "bg-team-blue" : "bg-team-red"
        } rounded-full opacity-80`}
        style={{
          width: '4px',
          height: '4px',
          boxShadow: `0 0 6px ${team === "blue" ? "hsl(var(--team-blue))" : "hsl(var(--team-red))"}`,
        }}
      />
    </div>
  );
};