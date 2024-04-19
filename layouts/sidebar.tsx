import React, { useContext, useEffect } from "react";
import {
  Pane,
  Button,
  ChevronRightIcon,
  CrossIcon,
  ChevronLeftIcon,
  PaneProps,
} from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import LayoutContext from "@/contexts/layout";

interface SidebarProps extends PaneProps {
  isHidden: boolean;
  size: number;
  onToggle: (isHidden: boolean) => void;
  top: number;
  bottom: number;
}

function Sidebar({
  isHidden = false,
  size,
  onToggle,
  top,
  bottom = 0,
  ...props
}: SidebarProps) {
  const { setEditingId, isEditing, setIsEditing } = useContext(BalDataContext);
  const { isMobile } = useContext(LayoutContext);
  const handleClick = () => {
    if (isEditing) {
      setEditingId(null);
      setIsEditing(false);
    } else {
      onToggle(!isHidden);
    }
  };

  useEffect(() => {
    if (isEditing && isHidden && !isMobile) {
      // Force opening sidebar when editing
      onToggle(false);
    }
  }, [isEditing, isHidden, isMobile, onToggle]);

  return (
    <Pane
      position="fixed"
      width={size}
      transition="left 0.3s"
      maxWidth="100vw"
      left={isHidden ? -size : 0}
      right="auto"
      top={top}
      bottom={bottom}
      zIndex={2}
    >
      {!isMobile && (
        <Pane
          background="white"
          position="absolute"
          top={15}
          right={0}
          transform="translateX(100%)"
        >
          <Button
            height={50}
            paddingX={8}
            borderRadius={0}
            onClick={handleClick}
          >
            {isHidden ? (
              <ChevronRightIcon />
            ) : isEditing ? (
              <CrossIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </Button>
        </Pane>
      )}

      <Pane
        height={isMobile ? "calc(100% - 50px)" : "100%"}
        maxHeight="100%"
        width="100%"
        maxWidth="100%"
        flex={1}
        overflow="hidden"
        {...props}
      />
    </Pane>
  );
}

export default Sidebar;
