import React from "react";
import { Pane, Badge } from "evergreen-ui";
import RefreshIconRotate from "@/components/refresh-icon-rotate/refresh-icon-rotate";

function RefreshSyncBadge() {
  return (
    <Badge
      data-testid="status-badge"
      display="flex"
      justifyContent="center"
      height={28}
      width="100%"
    >
      <Pane display="flex" alignItems="center">
        Synchronisation en cours <RefreshIconRotate />
      </Pane>
    </Badge>
  );
}

export default React.memo(RefreshSyncBadge);
