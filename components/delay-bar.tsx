import { Pane } from "evergreen-ui";

interface DelayBarProps {
  delay: string;
}

export function DelayBar({ delay }: DelayBarProps) {
  return (
    <Pane flex={1} height={35} background="gray500" borderRadius={5}>
      <Pane
        display="flex"
        alignItems="center"
        height={35}
        borderRadius={5}
        background="green500"
        animation={`delay-bar ${delay} linear forwards`}
      />
    </Pane>
  );
}
