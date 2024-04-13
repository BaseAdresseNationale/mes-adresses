import { Badge, Pane, Paragraph, Strong } from "evergreen-ui";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { CommuneType } from "@/types/commune";
import SignalementCard from "../signalement-card";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import { Position, Toponyme } from "@/lib/openapi";
import PositionItem from "@/components/bal/position-item";
import MarkersContext from "@/contexts/markers";
import {
  Signalement,
  Position as PositionSignalement,
} from "@/lib/openapi-signalement";

interface SignalementUpdateToponymeProps {
  signalement: Signalement;
  existingLocation: Toponyme;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  commune: CommuneType;
}

const detectChanges = (signalement, existingLocation: Toponyme) => {
  const { nom } = signalement.changesRequested;

  const { nom: existingNom } = existingLocation;

  return {
    nom: existingNom !== nom,
    positions: false,
    parcelles: false,
    // positions:
    //   JSON.stringify(positions.map(({ point, type }) => ({ point, type }))) !==
    //   JSON.stringify(
    //     existingPositions.map(({ point, type }) => ({ point, type }))
    //   ),
    // parcelles: JSON.stringify(parcelles) !== JSON.stringify(existingParcelles),
  };
};

function SignalementUpdateToponyme({
  signalement,
  existingLocation,
  handleSubmit,
  handleClose,
  commune,
}: SignalementUpdateToponymeProps) {
  const { nom, positions, parcelles } = signalement.changesRequested;

  const nomInputRef = useRef<HTMLDivElement>(null);
  const positionsInputRef = useRef<HTMLDivElement>(null);
  const parcellesInputRef = useRef<HTMLDivElement>(null);

  const refs = useMemo(
    () => ({
      nom: nomInputRef,
      positions: positionsInputRef,
      parcelles: parcellesInputRef,
    }),
    []
  );

  const { markers, addMarker, removeMarker, disableMarkers } =
    useContext(MarkersContext);

  const [changes, setChanges] = useState(
    detectChanges(signalement, existingLocation)
  );
  const [refsInitialized, setRefsInitialized] = useState(false);
  const [editorValue, setEditorValue] = useState(existingLocation);

  useEffect(() => {
    const refKeys = Object.keys(refs);
    refKeys.forEach((key) => {
      if (refs[key].current) {
        changes[key]
          ? (refs[key].current.style.border = "solid #f3b346 2px")
          : (refs[key].current.style.border = "none");
      }
    });
    if (refKeys.every((key) => Boolean(refs[key].current))) {
      setRefsInitialized(true);
    }
  }, [refs, changes]);

  useEffect(() => {
    if (positions) {
      positions.forEach((position: PositionSignalement & { _id: string }) => {
        changes.positions
          ? addMarker({
              _id: position._id,
              isMapMarker: true,
              isDisabled: true,
              color: "warning",
              label: `${position.type} - ${nom}`,
              longitude: position.point.coordinates[0],
              latitude: position.point.coordinates[1],
              type: position.type as unknown as Position.type,
            })
          : removeMarker(position._id);
      });
    }

    return () => {
      disableMarkers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, changes.positions]);

  const handleAcceptChange = (key: string, value: any) => {
    setEditorValue({ ...editorValue, [key]: value });
    setChanges({ ...changes, [key]: false });
  };

  const handleRefuseChange = (key: string) => {
    setChanges({ ...changes, [key]: false });
  };

  return (
    <Pane position="relative" height="100%">
      <ToponymeEditor
        commune={commune}
        initialValue={editorValue}
        closeForm={handleClose}
        refs={refs}
        onSubmitted={handleSubmit}
      />
      {refsInitialized &&
        changes.nom &&
        ReactDOM.createPortal(
          <SignalementCard
            onAccept={() => handleAcceptChange("nom", nom)}
            onRefuse={() => handleRefuseChange("nom")}
          >
            <Paragraph>{nom}</Paragraph>
          </SignalementCard>,
          refs.nom.current
        )}
      {refsInitialized &&
        changes.positions &&
        ReactDOM.createPortal(
          <SignalementCard
            onAccept={() => handleAcceptChange("positions", positions)}
            onRefuse={() => handleRefuseChange("positions")}
          >
            <Pane display="grid" gridTemplateColumns="2fr .5fr 1fr 1fr .5fr">
              <Strong fontWeight={400} paddingBottom=".5em">
                Type
              </Strong>
              <div />
              <Strong fontWeight={400}>Latitude</Strong>
              <Strong fontWeight={400}>Longitude</Strong>
              <div />

              {markers
                .filter(({ isMapMarker }) => isMapMarker)
                .map((marker) => (
                  <PositionItem key={marker._id} marker={marker} />
                ))}
            </Pane>
          </SignalementCard>,
          refs.positions.current
        )}
      {refsInitialized &&
        changes.parcelles &&
        ReactDOM.createPortal(
          <SignalementCard
            onAccept={() => handleAcceptChange("parcelles", parcelles)}
            onRefuse={() => handleRefuseChange("parcelles")}
          >
            {parcelles.map((parcelle) => (
              <Badge
                key={parcelle}
                isInteractive
                color="green"
                margin={4}
                width="fit-content"
              >
                {parcelle}
              </Badge>
            ))}
          </SignalementCard>,
          refs.parcelles.current
        )}
    </Pane>
  );
}

export default SignalementUpdateToponyme;
