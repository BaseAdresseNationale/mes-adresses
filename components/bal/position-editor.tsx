import { useCallback, useEffect, useContext } from "react";
import {
  Strong,
  Pane,
  Heading,
  Button,
  AddIcon,
  FormField,
} from "evergreen-ui";

import MarkersContext from "@/contexts/markers";

import InputLabel from "@/components/input-label";
import PositionItem from "./position-item";
import { Position } from "@/lib/openapi";
import LayoutContext from "@/contexts/layout";

interface PositionEditorProps {
  initialPositions: any[];
  isToponyme?: boolean;
  validationMessage?: string;
}

function PositionEditor({
  initialPositions,
  isToponyme,
  validationMessage,
}: PositionEditorProps) {
  const { isMobile, setIsMapFullscreen } = useContext(LayoutContext);
  const { markers, addMarker, updateMarker, removeMarker, disableMarkers } =
    useContext(MarkersContext);

  const handleAddMarker = useCallback(() => {
    addMarker({
      type: isToponyme ? Position.type.SEGMENT : Position.type.ENTR_E,
    });
    isMobile && setIsMapFullscreen(true);
  }, [isToponyme, addMarker, isMobile, setIsMapFullscreen]);

  useEffect(() => {
    if (initialPositions) {
      const positions = initialPositions.map((position) => ({
        longitude: position.point.coordinates[0],
        latitude: position.point.coordinates[1],
        type: position.type,
      }));

      positions.forEach((position) => addMarker(position));
    } else {
      handleAddMarker();
    }

    return () => {
      disableMarkers();
    };

    // Remove addMarker and handleAddMarker from hooks to prevent useEffect running when viewport changing
  }, [initialPositions, disableMarkers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormField label="" validationMessage={validationMessage}>
      <InputLabel
        title="Positions"
        help={
          markers.length > 1
            ? "Déplacer les marqueurs sur la carte pour modifier les positions"
            : markers.length === 1
              ? `Déplacer le marqueur sur la carte pour déplacer le ${
                  isToponyme ? "toponyme" : "numéro"
                }.`
              : `Déplacer le marqueur sur la carte pour placer le ${
                  isToponyme ? "toponyme" : "numéro"
                }.`
        }
      />

      {markers.length > 0 ? (
        <Pane display="grid" gridTemplateColumns="2fr .5fr 1fr 1fr .5fr">
          <Strong fontWeight={400} paddingBottom=".5em">
            Type
          </Strong>
          <div />
          <Strong fontWeight={400}>Latitude</Strong>
          <Strong fontWeight={400}>Longitude</Strong>
          <div />

          {markers
            .filter(({ isDisabled }) => !isDisabled)
            .map((marker) => (
              <PositionItem
                key={marker._id}
                marker={marker}
                isRemovable={isToponyme ? false : markers.length === 1}
                handleChange={updateMarker}
                onRemove={removeMarker}
              />
            ))}
        </Pane>
      ) : (
        <Pane paddingBottom=".5em" textAlign="center">
          <Heading size={400}>Ce toponyme n’a pas de position</Heading>
        </Pane>
      )}

      <Button
        type="button"
        iconBefore={AddIcon}
        appearance="primary"
        intent="success"
        width="100%"
        marginBottom={0}
        display="flex"
        justifyContent="center"
        onClick={handleAddMarker}
      >
        {`Ajouter une position au ${isToponyme ? "toponyme" : "numéro"}`}
      </Button>
    </FormField>
  );
}

export default PositionEditor;
