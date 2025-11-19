import { useContext, useMemo, useState, useEffect } from "react";
import { Pane, SelectMenu, Button, Position, LayersIcon } from "evergreen-ui";

import CadastreControl from "@/components/map/controls/cadastre-control";
import { CommuneType } from "@/types/commune";
import { MapStyle } from "@/contexts/map";
import LocalStorageContext from "@/contexts/local-storage";
import BalDataContext from "@/contexts/bal-data";

interface StyleControlProps {
  style: string;
  handleStyle: (style: MapStyle) => void;
  isCadastreDisplayed: boolean;
  handleCadastre: (fn: (show: boolean) => boolean) => void;
  commune: CommuneType;
}

function StyleControl({
  style,
  commune,
  handleStyle,
  isCadastreDisplayed,
  handleCadastre,
}: StyleControlProps) {
  const [showPopover, setShowPopover] = useState(false);
  const { baseLocale } = useContext(BalDataContext);
  const { registeredMapStyle, setRegisteredMapStyle } =
    useContext(LocalStorageContext);
  const { styleMaps } = useContext(LocalStorageContext);

  const availableStyles = useMemo(() => {
    const { hasOrtho, hasOpenMapTiles, hasPlanIGN } = commune;
    return [
      {
        label: "Photographie aérienne",
        value: MapStyle.ORTHO,
        isAvailable: hasOrtho,
      },
      {
        label: "Plan OpenStreetMap",
        value: MapStyle.VECTOR,
        isAvailable: hasOpenMapTiles,
      },
      { label: "Plan IGN", value: MapStyle.PLAN_IGN, isAvailable: hasPlanIGN },
      ...styleMaps.map((styleMap) => ({
        label: styleMap.name,
        value: styleMap.id,
        isAvailable: true,
      })),
    ].filter(({ isAvailable }) => isAvailable);
  }, [commune, styleMaps]);

  const onSelect = (style) => {
    const updatedRegisteredMapStyle = registeredMapStyle
      ? { ...registeredMapStyle, [baseLocale.id]: style.value }
      : { [baseLocale.id]: style.value };
    setRegisteredMapStyle(updatedRegisteredMapStyle);
    handleStyle(style.value as MapStyle);
  };

  useEffect(() => {
    if (!availableStyles.find(({ value }) => value === style)) {
      onSelect(availableStyles[0].value);
    }
  }, [availableStyles]);

  return (
    <Pane
      position="absolute"
      display="flex"
      left={22}
      bottom={22}
      border="none"
      elevation={2}
      zIndex={2}
      cursor="pointer"
      onClick={() => setShowPopover(!showPopover)}
    >
      {availableStyles.length > 1 ? (
        <SelectMenu
          closeOnSelect
          position={Position.TOP_LEFT}
          title="Choix du fond de carte"
          hasFilter={false}
          height={40 + 33 * availableStyles.length}
          options={availableStyles}
          selected={style}
          onSelect={onSelect}
        >
          <Button
            className="map-style-button"
            style={{ borderRadius: "3px 0 0 3px" }}
          >
            <LayersIcon
              style={{ marginRight: ".5em", borderRadius: "0 3px 3px 0" }}
            />
            <div className="map-style-label">
              {availableStyles.find(({ value }) => value === style)?.label}
            </div>
          </Button>
        </SelectMenu>
      ) : (
        <Button
          className="map-style-button"
          style={{ borderRadius: "3px 0 0 3px" }}
        >
          <LayersIcon
            style={{ marginRight: ".5em", borderRadius: "0 3px 3px 0" }}
          />
          <div className="map-style-label">{availableStyles[0].label}</div>
        </Button>
      )}
      <CadastreControl
        hasCadastre={commune.hasCadastre}
        isCadastreDisplayed={isCadastreDisplayed}
        onClick={() => handleCadastre((show) => !show)}
      />
    </Pane>
  );
}

export default StyleControl;
