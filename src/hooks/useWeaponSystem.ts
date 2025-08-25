import { useState, useEffect, useCallback, useRef } from "react";

export interface WeaponProjectile {
  id: string;
  type: "laser" | "bouncy" | "missile" | "grenade" | "shrapnel";
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  ttl: number;
  maxTTL: number;
  team: "blue" | "red";
  bounces?: number;
  source?: "missile" | "grenade";
}

export interface WeaponSettings {
  shipSpeed: number;
  laserDamage: number;
  laserEnergy: number;
  laserTTL: number;
  laserSpeed: number;
  missileDamage: number;
  missileEnergy: number;
  missileTTL: number;
  missileSpeed: number;
  bouncyDamage: number;
  bouncyEnergy: number;
  bouncyTTL: number;
  bouncySpeed: number;
  nadeDamage: number;
  nadeEnergy: number;
  shrapTTL: number;
  shrapSpeed: number;
  nadeSpeed: number;
  healthBonus: number;
}

const DEFAULT_SETTINGS: WeaponSettings = {
  shipSpeed: 100,
  laserDamage: 27,
  laserEnergy: 12,
  laserTTL: 480,
  laserSpeed: 50,
  missileDamage: 102,
  missileEnergy: 37,
  missileTTL: 480,
  missileSpeed: 50,
  bouncyDamage: 48,
  bouncyEnergy: 12,
  bouncyTTL: 970,
  bouncySpeed: 50,
  nadeDamage: 21,
  nadeEnergy: 19,
  shrapTTL: 128,
  shrapSpeed: 50,
  nadeSpeed: 50,
  healthBonus: 60,
};

export type WeaponType = "laser" | "bouncy" | "missile" | "grenade";

export const useWeaponSystem = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponType>("laser");
  const [projectiles, setProjectiles] = useState<WeaponProjectile[]>([]);
  const [settings] = useState<WeaponSettings>(DEFAULT_SETTINGS);
  const projectileIdRef = useRef(0);

  const createProjectile = useCallback((
    type: WeaponType,
    x: number,
    y: number,
    angle: number,
    team: "blue" | "red"
  ): WeaponProjectile => {
    const id = `${type}-${projectileIdRef.current++}`;
    
    switch (type) {
      case "laser":
        return {
          id,
          type,
          x,
          y,
          angle,
          speed: settings.laserSpeed,
          damage: settings.laserDamage,
          ttl: settings.laserTTL,
          maxTTL: settings.laserTTL,
          team,
        };
      case "bouncy":
        return {
          id,
          type,
          x,
          y,
          angle,
          speed: settings.bouncySpeed,
          damage: settings.bouncyDamage,
          ttl: settings.bouncyTTL,
          maxTTL: settings.bouncyTTL,
          team,
          bounces: 0,
        };
      case "missile":
        return {
          id,
          type,
          x,
          y,
          angle,
          speed: settings.missileSpeed,
          damage: settings.missileDamage,
          ttl: settings.missileTTL,
          maxTTL: settings.missileTTL,
          team,
        };
      case "grenade":
        return {
          id,
          type,
          x,
          y,
          angle,
          speed: settings.nadeSpeed,
          damage: settings.nadeDamage,
          ttl: settings.missileTTL, // Grenades use missile TTL
          maxTTL: settings.missileTTL,
          team,
        };
      default:
        throw new Error(`Unknown weapon type: ${type}`);
    }
  }, [settings]);

  const fireWeapon = useCallback((
    weaponType: WeaponType,
    x: number,
    y: number,
    angle: number,
    team: "blue" | "red"
  ) => {
    const projectile = createProjectile(weaponType, x, y, angle, team);
    setProjectiles(prev => [...prev, projectile]);
  }, [createProjectile]);

  const cycleWeapon = useCallback((direction: "next" | "prev" = "next") => {
    const weapons: WeaponType[] = ["laser", "bouncy", "missile", "grenade"];
    const currentIndex = weapons.indexOf(selectedWeapon);
    
    if (direction === "next") {
      setSelectedWeapon(weapons[(currentIndex + 1) % weapons.length]);
    } else {
      setSelectedWeapon(weapons[(currentIndex - 1 + weapons.length) % weapons.length]);
    }
  }, [selectedWeapon]);

  const createShrapnel = useCallback((
    x: number,
    y: number,
    team: "blue" | "red",
    source: "missile" | "grenade",
    count: number = 36
  ) => {
    const shrapnelPieces: WeaponProjectile[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      shrapnelPieces.push({
        id: `shrapnel-${projectileIdRef.current++}`,
        type: "shrapnel",
        x,
        y,
        angle,
        speed: settings.shrapSpeed,
        damage: source === "grenade" ? settings.laserDamage : settings.nadeDamage,
        ttl: settings.shrapTTL,
        maxTTL: settings.shrapTTL,
        team,
        source,
      });
    }
    
    setProjectiles(prev => [...prev, ...shrapnelPieces]);
  }, [settings]);

  // Update projectiles
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles(prev => {
        const updated = prev.map(projectile => {
          const newX = projectile.x + Math.cos(projectile.angle) * projectile.speed * 0.1;
          const newY = projectile.y + Math.sin(projectile.angle) * projectile.speed * 0.1;
          
          let newProjectile = {
            ...projectile,
            x: newX,
            y: newY,
            ttl: projectile.ttl - 1,
          };

          // Handle bouncy laser wall bouncing
          if (projectile.type === "bouncy") {
            const fieldBounds = { left: 20, right: 780, top: 20, bottom: 530 };
            let bounced = false;
            
            if (newX <= fieldBounds.left || newX >= fieldBounds.right) {
              newProjectile.angle = Math.PI - projectile.angle;
              newProjectile.bounces = (projectile.bounces || 0) + 1;
              bounced = true;
            }
            
            if (newY <= fieldBounds.top || newY >= fieldBounds.bottom) {
              newProjectile.angle = -projectile.angle;
              newProjectile.bounces = (projectile.bounces || 0) + 1;
              bounced = true;
            }
            
            if (bounced) {
              newProjectile.x = Math.max(fieldBounds.left, Math.min(fieldBounds.right, newX));
              newProjectile.y = Math.max(fieldBounds.top, Math.min(fieldBounds.bottom, newY));
            }
          }

          return newProjectile;
        });

        // Handle explosions
        const explosions: WeaponProjectile[] = [];
        const surviving = updated.filter(projectile => {
          if (projectile.ttl <= 0) {
            if (projectile.type === "missile") {
              createShrapnel(projectile.x, projectile.y, projectile.team, "missile", 12);
            } else if (projectile.type === "grenade") {
              createShrapnel(projectile.x, projectile.y, projectile.team, "grenade", 36);
            }
            return false;
          }
          return true;
        });

        return surviving;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [createShrapnel]);

  return {
    selectedWeapon,
    projectiles,
    settings,
    fireWeapon,
    cycleWeapon,
    setSelectedWeapon,
  };
};