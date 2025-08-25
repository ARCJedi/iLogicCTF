interface ShrapnelProps {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  ttl: number;
  team: "blue" | "red";
  source?: "missile" | "grenade";
}

export const Shrapnel = ({ x, y, angle, team }: ShrapnelProps) => {
  return (
    <div
      className="absolute pointer-events-none z-19"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${angle}rad)`,
      }}
    >
      <div
        className={`${
          team === "blue" ? "bg-team-blue" : "bg-team-red"
        } opacity-70`}
        style={{
          width: '6px',
          height: '1px',
          boxShadow: `0 0 3px ${team === "blue" ? "hsl(var(--team-blue))" : "hsl(var(--team-red))"}`,
        }}
      />
    </div>
  );
};