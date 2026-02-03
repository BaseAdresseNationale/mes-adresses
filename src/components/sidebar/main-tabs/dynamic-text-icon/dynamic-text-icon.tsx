"use client";

import React, { useEffect, useRef } from "react";
import styles from "./dynamic-text-icon.module.css";
import { Text } from "evergreen-ui";

interface DynamicTextIconProps {
  children: React.ReactNode;
  className?: string;
  selectedTextIndex: number;
  texts: string[];
}

function DynamicTextIcon({
  texts,
  children,
  className,
  selectedTextIndex,
}: DynamicTextIconProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const textElement = textRef.current;
    textElement.classList.add(styles.blurEffect);
    setTimeout(() => {
      textElement.classList.remove(styles.blurEffect);
    }, 1000);
  }, [selectedTextIndex]);

  return (
    <div className={[className, styles.dynamicTextIcon].join(" ")}>
      {children}
      <Text ref={textRef}>{texts[selectedTextIndex]}</Text>
    </div>
  );
}
export default DynamicTextIcon;
