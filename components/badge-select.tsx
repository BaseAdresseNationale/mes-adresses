import { Pane, Badge } from "evergreen-ui";

interface BadgeSelectProps {
  options: readonly string[];
  onChange: (value: string) => void;
  value: string;
}

export function BadgeSelect({ options, onChange, value }: BadgeSelectProps) {
  return (
    <Pane display="flex" flexWrap="wrap">
      {options.map((option) => (
        <Badge
          key={option}
          marginRight={8}
          marginBottom={8}
          onClick={() => onChange(option)}
          isInteractive
          color={value === option ? "blue" : "neutral"}
          userSelect="none"
        >
          {option}
        </Badge>
      ))}
    </Pane>
  );
}
