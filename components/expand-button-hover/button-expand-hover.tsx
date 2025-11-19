import { Icon, IconComponent, Button } from "evergreen-ui";
import styles from "./button-expand-hover.module.css";

interface ButtonIconExpandHoverProps {
  message: string;
  [props: string]: any;
}

export function ButtonIconExpandHover({
  message,
  ...props
}: ButtonIconExpandHoverProps) {
  return (
    <Button
      {...props}
      className={styles["button-expand"]}
      paddingLeft={props.size === "small" ? 4 : 8}
      paddingRight={props.size === "small" ? 4 : 8}
    >
      <span>{message}</span>
      <Icon size={14} icon={props.icon as IconComponent} />
    </Button>
  );
}
