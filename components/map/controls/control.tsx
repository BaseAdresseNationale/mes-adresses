import { useCallback } from "react";
import { Pane, Tooltip, Position, Icon } from "evergreen-ui";

interface ControlProps {
  isEnabled?: boolean;
  isDisabled?: boolean;
  icon: any;
  enabledHint: string;
  disabledHint: string;
  onChange: (fn: (enabled: boolean) => boolean) => void;
}

function Control({
  isEnabled = true,
  isDisabled,
  icon,
  enabledHint,
  disabledHint,
  onChange,
}: ControlProps) {
  const onToggle = useCallback(
    (e) => {
      e.stopPropagation();
      onChange((enabled) => !enabled);
    },
    [onChange]
  );

  if (isDisabled) {
    return (
      <Pane is="button" className="maplibregl-ctrl-icon">
        <Icon icon={icon} color="muted" />
      </Pane>
    );
  }

  return (
    <Tooltip
      position={Position.LEFT}
      content={isEnabled ? enabledHint : disabledHint}
    >
      <Pane is="button" className="maplibregl-ctrl-icon" onClick={onToggle}>
        <Icon icon={icon} color={isDisabled ? "muted" : "black"} />
      </Pane>
    </Tooltip>
  );
}

export default Control;
