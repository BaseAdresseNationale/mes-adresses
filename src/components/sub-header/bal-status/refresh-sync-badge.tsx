import React from "react";
import { Pane, Badge } from "evergreen-ui";
import RefreshIconRotate from "./refresh-icon-rotate/refresh-icon-rotate";

function RefreshSyncBadge() {
  return (
    <Badge
      display="flex"
      justifyContent="center"
      color="neutral"
      height="100%"
      width="100%"
    >
      <Pane display="flex" alignItems="center">
        Synchronisation en cours <RefreshIconRotate />
      </Pane>
    </Badge>
  );
}

export default React.memo(RefreshSyncBadge);
