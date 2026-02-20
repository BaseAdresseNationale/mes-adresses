import { Pane, Strong, Text } from "evergreen-ui";

interface CounterProps {
  label: string;
  value: number;
  color?: string;
}

function Counter({ label, value, color }: CounterProps) {
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingTop={8}
      margin={5}
      width="100%"
    >
      <Text fontSize=".9em" color={color} textAlign="center">
        <Strong size={600} color={color}>
          {value}
        </Strong>{" "}
        {label}
      </Text>
    </Pane>
  );
}

export default Counter;
