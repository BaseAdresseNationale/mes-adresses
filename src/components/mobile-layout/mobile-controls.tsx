import { Button, ListIcon, MapIcon, Pane } from "evergreen-ui";

interface MobileControlsProps {
  onToggle: (showMap: boolean) => void;
  isMapFullscreen: boolean;
  isDemo: boolean;
}

export function MobileControls({
  onToggle,
  isMapFullscreen,
  isDemo,
}: MobileControlsProps) {
  return (
    <Pane
      position="absolute"
      width="100%"
      height={50}
      bottom={isDemo ? 50 : 0}
      display="flex"
      justifyContent="space-around"
      background="white"
      zIndex={2}
    >
      <Button
        isActive={!isMapFullscreen}
        onClick={() => onToggle(false)}
        height="100%"
        flexGrow={1}
        border="none"
      >
        <ListIcon />
      </Button>
      <Button
        isActive={isMapFullscreen}
        onClick={() => onToggle(true)}
        height="100%"
        flexGrow={1}
        border="none"
      >
        <MapIcon />
      </Button>
    </Pane>
  );
}
