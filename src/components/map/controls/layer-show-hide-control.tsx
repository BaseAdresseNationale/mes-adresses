import { Switch, Pane, Label } from "evergreen-ui";

interface LayerShowHideControlProps {
  title: string;
  isDiplayed: boolean;
  setIsDiplayed: (isDiplayed: boolean) => void;
}

function LayerShowHideControl({
  title,
  isDiplayed,
  setIsDiplayed,
}: LayerShowHideControlProps) {
  return (
    <Pane marginBottom={4}>
      <Pane
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="8px"
      >
        <Pane display="flex" flexDirection="row">
          <Label display="block" marginRight={4}>
            {title}
          </Label>
        </Pane>
        <Pane display="flex" flexDirection="row" alignItems="center">
          <Switch
            height={24}
            checked={isDiplayed}
            onChange={() => setIsDiplayed(!isDiplayed)}
          />
        </Pane>
      </Pane>
    </Pane>
  );
}

export default LayerShowHideControl;
