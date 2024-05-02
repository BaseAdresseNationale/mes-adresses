import { Heading, Pane, Text } from "evergreen-ui";

interface CounterProps {
  label: string;
  value: number;
  color?: string;
}

function Counter({ label, value, color }: CounterProps) {
  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      paddingX={5}
      paddingY={10}
      margin={5}
      width="100%"
    >
      <Heading size={600} color={color}>
        {value}
      </Heading>
      <Text fontSize=".9em" marginTop={4}>
        {label}
      </Text>
    </Pane>
  );
}

export default Counter;
