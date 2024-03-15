import { Badge, Pane, Paragraph, Strong } from "evergreen-ui";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import NumeroEditor from "../bal/numero-editor";
import { CommuneType } from "@/types/commune";
import SignalementCard from "./signalement-card";
import MarkersContext from "@/contexts/markers";
import PositionItem from "../bal/position-item";

interface SignalementEditorProps {
  signalement: any;
  existingLocation: any;
  handleSubmit: () => void;
  handleClose: () => void;
  commune: CommuneType;
}

const detectChanges = (signalement, existingLocation) => {
  const { numero, suffixe, positions, parcelles } =
    signalement.changesRequested;

  const numeroComplet = `${numero}${suffixe ? suffixe : ""}`;

  const {
    numeroComplet: existingNumeroComplet,
    positions: existingPositions,
    parcelles: existingParcelles,
  } = existingLocation;

  return {
    numero: numeroComplet !== existingNumeroComplet,
    positions:
      JSON.stringify(positions.map(({ point, type }) => ({ point, type }))) !==
      JSON.stringify(
        existingPositions.map(({ point, type }) => ({ point, type }))
      ),
    parcelles: JSON.stringify(parcelles) !== JSON.stringify(existingParcelles),
  };
};

function SignalementEditor({
  signalement,
  existingLocation,
  handleSubmit,
  handleClose,
  commune,
}: SignalementEditorProps) {
  const numeroInputRef = useRef<HTMLDivElement>(null);
  const positionsInputRef = useRef<HTMLDivElement>(null);
  const parcellesInputRef = useRef<HTMLDivElement>(null);
  const { markers, addMarker, removeMarker, disableMarkers } =
    useContext(MarkersContext);

  const [changes, setChanges] = useState(
    detectChanges(signalement, existingLocation)
  );
  const [refsInitialized, setRefsInitialized] = useState(false);
  const [numeroEditorValue, setNumeroEditorValue] = useState(existingLocation);

  const { numero, suffixe, positions, parcelles, nomVoie } =
    signalement.changesRequested;

  useEffect(() => {
    if (numeroInputRef.current) {
      changes.numero
        ? (numeroInputRef.current.style.border = "solid red 2px")
        : (numeroInputRef.current.style.border = "none");
    }
    if (positionsInputRef.current) {
      changes.positions
        ? (positionsInputRef.current.style.border = "solid red 2px")
        : (positionsInputRef.current.style.border = "none");
    }
    if (parcellesInputRef.current) {
      changes.parcelles
        ? (parcellesInputRef.current.style.border = "solid red 2px")
        : (parcellesInputRef.current.style.border = "none");
    }
    if (
      numeroInputRef.current &&
      positionsInputRef.current &&
      parcellesInputRef.current
    ) {
      setRefsInitialized(true);
    }
  }, [numeroInputRef, positionsInputRef, parcellesInputRef, changes]);

  useEffect(() => {
    if (positions) {
      positions.forEach((position) => {
        changes.positions
          ? addMarker({
              _id: position._id,
              isMapMarker: true,
              isDisabled: true,
              color: "warning",
              label: `${position.type} - ${numero}${suffixe ? suffixe : ""}`,
              longitude: position.point.coordinates[0],
              latitude: position.point.coordinates[1],
              type: position.type,
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
    if (key === "numero") {
      setNumeroEditorValue({
        ...numeroEditorValue,
        numero: value[0],
        suffixe: value[1],
      });
    } else {
      setNumeroEditorValue({ ...numeroEditorValue, [key]: value });
    }

    setChanges({ ...changes, [key]: false });
  };

  const handleRefuseChange = (key: string) => {
    setChanges({ ...changes, [key]: false });
  };

  return (
    <Pane position="relative" height="100%">
      <NumeroEditor
        hasPreview
        initialValue={numeroEditorValue}
        initialVoieId={numeroEditorValue.voie?._id}
        commune={commune}
        closeForm={handleClose}
        onSubmitted={handleSubmit}
        refs={{
          numero: numeroInputRef,
          positions: positionsInputRef,
          parcelles: parcellesInputRef,
        }}
      />
      {refsInitialized &&
        changes.numero &&
        ReactDOM.createPortal(
          <SignalementCard
            onAccept={() => handleAcceptChange("numero", [numero, suffixe])}
            onRefuse={() => handleRefuseChange("numero")}
          >
            <Paragraph>
              {numero} {suffixe}
            </Paragraph>
          </SignalementCard>,
          numeroInputRef.current
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
          positionsInputRef.current
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
          parcellesInputRef.current
        )}
    </Pane>
  );
}

export default SignalementEditor;
