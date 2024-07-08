import { useCallback } from "react";
import {
  Select,
  Heading,
  Icon,
  Small,
  TrashIcon,
  MapMarkerIcon,
  IconButton,
} from "evergreen-ui";

import {
  getPositionName,
  positionsTypesList,
} from "@/lib/positions-types-list";
import { Marker } from "@/contexts/markers";

interface PositionItemProps {
  marker: Marker;
  isRemovable?: boolean;
  handleChange?: (id: string, value: Partial<Marker>) => void;
  onRemove?: (id: string) => void;
}

function PositionItem({
  marker,
  isRemovable,
  handleChange,
  onRemove,
}: PositionItemProps) {
  const onSelect = useCallback(
    (e) => {
      const type = e.target.value;
      handleChange && handleChange(marker._id, { ...marker, type });
    },
    [marker, handleChange]
  );

  const removeMarker = useCallback(
    (e) => {
      e.preventDefault();
      onRemove(marker._id);
    },
    [marker._id, onRemove]
  );

  return (
    <>
      {handleChange ? (
        <Select
          value={marker.type}
          marginBottom={8}
          height={32}
          onChange={onSelect}
        >
          {positionsTypesList.map((positionType) => (
            <option key={positionType.value} value={positionType.value}>
              {positionType.name}
            </option>
          ))}
        </Select>
      ) : (
        <Heading size={100} marginY="auto">
          <Small>{getPositionName(marker.type)}</Small>
        </Heading>
      )}
      <Icon icon={MapMarkerIcon} size={22} margin="auto" color={marker.color} />
      <Heading size={100} marginY="auto">
        <Small>
          {marker.latitude == undefined && marker.latitude.toFixed(6)}
        </Small>
      </Heading>
      <Heading size={100} marginY="auto">
        <Small>
          {marker.longitude == undefined && marker.longitude.toFixed(6)}
        </Small>
      </Heading>
      <IconButton
        disabled={isRemovable || !onRemove}
        appearance="default"
        iconSize={15}
        icon={TrashIcon}
        intent="danger"
        onClick={removeMarker}
        {...(!onRemove && { style: { visibility: "hidden" } })}
      />
    </>
  );
}

export default PositionItem;
