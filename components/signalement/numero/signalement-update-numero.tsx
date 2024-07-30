import { Alert, Badge, Button, Pane, Paragraph, Strong } from "evergreen-ui";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import NumeroEditor from "../../bal/numero-editor";
import { CommuneType } from "@/types/commune";
import SignalementCard from "../signalement-card";
import MarkersContext from "@/contexts/markers";
import PositionItem from "../../bal/position-item";
import { Numero, Position, Voie, VoiesService } from "@/lib/openapi";
import {
  Signalement,
  Position as PositionSignalement,
} from "@/lib/openapi-signalement";
import LayoutContext from "@/contexts/layout";

interface SignalementUpdateNumeroProps {
  signalement: Signalement;
  existingLocation: Numero & { voie: Voie };
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  commune: CommuneType;
}

const detectChanges = (signalement, existingLocation) => {
  const { numero, suffixe, positions, parcelles, nomVoie } =
    signalement.changesRequested;

  const numeroComplet = `${numero}${suffixe ? suffixe : ""}`;

  const {
    numeroComplet: existingNumeroComplet,
    positions: existingPositions,
    parcelles: existingParcelles,
    voie: existingVoie,
  } = existingLocation;

  return {
    voie: nomVoie !== existingVoie?.nom,
    numero: numeroComplet !== existingNumeroComplet,
    positions:
      JSON.stringify(positions.map(({ point, type }) => ({ point, type }))) !==
      JSON.stringify(
        existingPositions.map(({ point, type }) => ({ point, type }))
      ),
    parcelles: JSON.stringify(parcelles) !== JSON.stringify(existingParcelles),
  };
};

function SignalementUpdateNumero({
  signalement,
  existingLocation,
  handleSubmit,
  handleClose,
  commune,
}: SignalementUpdateNumeroProps) {
  const voieInputRef = useRef<HTMLDivElement>(null);
  const numeroInputRef = useRef<HTMLDivElement>(null);
  const positionsInputRef = useRef<HTMLDivElement>(null);
  const parcellesInputRef = useRef<HTMLDivElement>(null);

  const refs = useMemo(
    () => ({
      voie: voieInputRef,
      numero: numeroInputRef,
      positions: positionsInputRef,
      parcelles: parcellesInputRef,
    }),
    []
  );

  const { markers, addMarker, removeMarker, disableMarkers } =
    useContext(MarkersContext);

  const { pushToast } = useContext(LayoutContext);

  const [changes, setChanges] = useState(
    detectChanges(signalement, existingLocation)
  );
  const [refsInitialized, setRefsInitialized] = useState(false);
  const [voieWillBeRenamed, setVoieWillBeRenamed] = useState(false);
  const [numeroEditorValue, setNumeroEditorValue] = useState(existingLocation);

  const { numero, suffixe, positions, parcelles, nomVoie } =
    signalement.changesRequested;

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
              id: position._id,
              isMapMarker: true,
              isDisabled: true,
              color: "warning",
              label: `${position.type} - ${numero}${suffixe ? suffixe : ""}`,
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

  const onSubmitted = useCallback(async () => {
    if (voieWillBeRenamed) {
      try {
        await VoiesService.updateVoie(existingLocation.voie.id, {
          nom: nomVoie,
        });
      } catch (e) {
        pushToast({
          title: "Le renommage de la voie a échoué",
          intent: "danger",
        });
        console.error(e);
      }
    }
    await handleSubmit();
  }, [voieWillBeRenamed, handleSubmit, existingLocation, nomVoie, pushToast]);

  return (
    <Pane position="relative" height="100%">
      <NumeroEditor
        hasPreview
        initialValue={numeroEditorValue}
        initialVoieId={numeroEditorValue.voie?.id}
        commune={commune}
        closeForm={handleClose}
        onSubmitted={onSubmitted}
        onVoieChanged={() => handleRefuseChange("voie")}
        refs={refs}
      />
      {refsInitialized &&
        changes.voie &&
        ReactDOM.createPortal(
          voieWillBeRenamed ? (
            <Alert
              intent="success"
              hasIcon={false}
              marginTop={10}
              title="Modification prise en compte"
            >
              <Pane display="flex" flexDirection="column" marginTop={10}>
                <Paragraph>
                  Après l&apos;enregistrement, la voie &quot;
                  {existingLocation.voie.nom}&quot; sera renommée en &quot;
                  {nomVoie}&quot;.
                </Paragraph>
                <Pane marginTop={10}>
                  <Button
                    onClick={() => setVoieWillBeRenamed(false)}
                    type="button"
                  >
                    Annuler
                  </Button>
                </Pane>
              </Pane>
            </Alert>
          ) : (
            <SignalementCard
              onAccept={() => setVoieWillBeRenamed(true)}
              onRefuse={() => handleRefuseChange("voie")}
            >
              <Paragraph>{nomVoie}</Paragraph>
            </SignalementCard>
          ),
          refs.voie.current
        )}
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
          refs.numero.current
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
                  <PositionItem key={marker.id} marker={marker} />
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

export default SignalementUpdateNumero;
