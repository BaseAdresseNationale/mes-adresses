import {
  Icon,
  IconComponent,
  Button,
  IconButtonOwnProps,
  BoxComponent,
  PolymorphicBoxProps,
} from "evergreen-ui";
import styles from "./button-expand-hover.module.css";

interface ButtonIconExpandHoverProps
  extends PolymorphicBoxProps<"button", IconButtonOwnProps> {
  message: string;
}

export function ButtonIconExpandHover({
  message,
  ...props
}: ButtonIconExpandHoverProps) {
  return (
    <Button {...props} className={styles["button-expand"]}>
      <span>{message}</span>
      <Icon size={14} icon={props.icon as IconComponent} />
    </Button>
  );
}
