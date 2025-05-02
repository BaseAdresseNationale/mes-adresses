import {
  ExistingLocation,
  ExistingNumero,
  NumeroChangesRequestedDTO,
  Signalement,
} from "@/lib/openapi-signalement";
import { SignalementHeader } from "../signalement-header";
import Form from "@/components/form";
import { Button, Pane } from "evergreen-ui";
import { useContext, useEffect } from "react";
import MapContext from "@/contexts/map";
import SignalementViewerUpdateNumero from "./numero/signalement-viewer-update-numero";
import SignalementViewerCreateNumero from "./numero/signalement-viewer-create-numero";
import SignalementViewerUpdateVoie from "./voie/signalement-viewer-update-voie";
import SignalementViewerUpdateToponyme from "./toponyme/signalement-viewer-update-toponyme";
import SignalementViewerDeleteNumero from "./numero/signalement-viewer-delete-numero";

interface SignalementViewerProps {
  signalement: Signalement;
  author?: Signalement["author"];
  onClose: () => void;
}

export function SignalementViewer({
  signalement,
  author,
  onClose,
}: SignalementViewerProps) {
  const { map } = useContext(MapContext);

  // Point the map to the location of the signalement
  useEffect(() => {
    if (!map) {
      return;
    }

    let pointTo = null;
    const { changesRequested, existingLocation } = signalement;

    if ((changesRequested as NumeroChangesRequestedDTO).positions?.length > 0) {
      const position = (changesRequested as NumeroChangesRequestedDTO)
        .positions[0];
      pointTo = {
        latitude: position.point.coordinates[1],
        longitude: position.point.coordinates[0],
      };
    } else if ((existingLocation as ExistingNumero)?.position) {
      const position = (existingLocation as ExistingNumero).position;
      pointTo = {
        latitude: position.point.coordinates[1],
        longitude: position.point.coordinates[0],
      };
    }

    if (pointTo) {
      map.flyTo({
        center: [pointTo.longitude, pointTo.latitude],
        offset: [0, 0],
        zoom:
          signalement.type === Signalement.type.LOCATION_TO_CREATE ||
          signalement.existingLocation.type === ExistingLocation.type.NUMERO
            ? 20
            : 16.5,
        screenSpeed: 2,
      });
    }
  }, [signalement, map]);

  return (
    <Form
      closeForm={onClose}
      onFormSubmit={(e) => {
        e.preventDefault();

        return Promise.resolve();
      }}
    >
      <SignalementHeader signalement={signalement} author={author} />

      {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
        <SignalementViewerCreateNumero signalement={signalement} />
      )}

      {signalement.type === Signalement.type.LOCATION_TO_UPDATE &&
        (signalement.existingLocation.type === ExistingLocation.type.NUMERO ? (
          <SignalementViewerUpdateNumero signalement={signalement} />
        ) : signalement.existingLocation.type === ExistingLocation.type.VOIE ? (
          <SignalementViewerUpdateVoie signalement={signalement} />
        ) : (
          <SignalementViewerUpdateToponyme signalement={signalement} />
        ))}

      {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementViewerDeleteNumero signalement={signalement} />
      )}

      <Pane
        position="sticky"
        bottom={-12}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        paddingY={10}
        backgroundColor="#e6e8f0"
        width="100%"
      >
        <Pane
          margin={4}
          boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
        >
          <Button
            type="button"
            appearance="default"
            display="inline-flex"
            onClick={onClose}
          >
            Fermer
          </Button>
        </Pane>
      </Pane>
    </Form>
  );
}
