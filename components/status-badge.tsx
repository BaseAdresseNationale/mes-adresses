import { Pane, Badge, Position, Tooltip, Icon } from "evergreen-ui";

import { computeStatus } from "@/lib/statuses";
import { BaseLocale, BaseLocaleSync } from "@/lib/openapi-api-bal";

interface StatusBadgeProps {
  status: BaseLocale.status;
  sync: Partial<BaseLocaleSync>;
  isHabilitationValid: boolean;
}

function StatusBadge({ status, sync, isHabilitationValid }: StatusBadgeProps) {
  const { color, label, content, icon, textColor } =
    computeStatus(status, sync, isHabilitationValid) || {};

  return (
    <Tooltip position={Position.BOTTOM_RIGHT} content={content}>
      <Badge
        display="flex"
        justifyContent="center"
        color={color}
        height="100%"
        width="100%"
      >
        <Pane display="flex" alignItems="center" color={textColor}>
          {label} <Icon icon={icon} size={14} marginLeft={4} />
        </Pane>
      </Badge>
    </Tooltip>
  );
}

export default StatusBadge;
