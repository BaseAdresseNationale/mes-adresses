import React from "react";
import { Pane, Badge, RefreshIcon } from "evergreen-ui";

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
        Synchronisation en cours{" "}
        <span>
          <RefreshIcon size={14} />
        </span>
      </Pane>

      <style jsx>{`
        /* Safari 4.0 - 8.0 */
        @-webkit-keyframes rotate {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        /* Standard syntax */
        @keyframes rotate {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        span {
          margin-left: 4px;
          width: 14px;
          height: 14px;
          -webkit-animation: rotate 2s linear infinite; /* Safari */
          animation: rotate 2s linear infinite;
        }
      `}</style>
    </Badge>
  );
}

export default React.memo(RefreshSyncBadge);
