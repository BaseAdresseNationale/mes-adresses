"use client";

import style from "./achievements-badge.module.css";
import NextImage from "next/image";

interface AchievementsProps {
  icone: string;
  title: string;
  completed: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function AchievementBadge({
  icone,
  title,
  completed,
  width = 32,
  height = 32,
  className,
}: AchievementsProps) {
  return (
    <div
      className={`${style["achievement-badge"]} ${
        completed ? style["green"] : style["disabled"]
      } ${className}`}
      style={{ width, height }}
    >
      <NextImage
        src={icone}
        alt={`Badge ${title}`}
        width={width}
        height={height}
      />
    </div>
  );
}

export default AchievementBadge;
