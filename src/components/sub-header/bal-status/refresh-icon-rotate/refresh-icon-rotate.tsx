import React from "react";
import { RefreshIcon } from "evergreen-ui";
import styles from "./refresh-icon-rotate.module.css";

function RefreshIconRotate() {
  return (
    <span className={styles.rotateIcon}>
      <RefreshIcon size={14} />
    </span>
  );
}

export default React.memo(RefreshIconRotate);
