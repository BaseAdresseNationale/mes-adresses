import React from "react";
import { Icon, IconComponent, Pane, Text } from "evergreen-ui";
import styles from "./button-circle-effect.module.css";

interface ButtonCircleEffectProps {
  label: string;
  onClick: () => void;
  icon: IconComponent;
}

function ButtonCircleEffect({ label, onClick, icon }: ButtonCircleEffectProps) {
  return (
    <button onClick={onClick} className={styles["button-circle-effect"]}>
      <Pane
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={0}
        position="relative"
      >
        <div className={styles.overlay} />
        <div className={styles["circle"]}>
          <Icon icon={icon} size={40} color="white" />
        </div>
      </Pane>
      <Pane marginTop={20} textAlign="center" zIndex={10} position="relative">
        <Text fontSize={18} fontWeight={500} className={styles["button-label"]}>
          {label}
        </Text>
      </Pane>
    </button>
  );
}

export default ButtonCircleEffect;
