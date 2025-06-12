import React from "react";
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
  return (
    <div className={[className, styles.dynamicTextIcon].join(" ")}>
      {children}
      {texts.map((text, index) => (
        <Text
          key={text}
          {...(index === selectedTextIndex
            ? { className: styles.visible }
            : {})}
        >
          {texts[selectedTextIndex]}
        </Text>
      ))}
    </div>
  );
}
export default DynamicTextIcon;
