"use client";

import style from "./achievements-badge.module.css";
import NextImage from "next/image";

interface AchievementsProps {
  icone: string;
  title: string;
  completed: boolean;
}

export function AchievementBadge({
  icone,
  title,
  completed,
}: AchievementsProps) {
  return (
    <div
      className={`${style["achievement-badge"]} ${
        completed ? style["green"] : style["disabled"]
      }`}
    >
      <NextImage src={icone} alt={`Badge ${title}`} width={32} height={32} />
    </div>
  );
}

export default AchievementBadge;
