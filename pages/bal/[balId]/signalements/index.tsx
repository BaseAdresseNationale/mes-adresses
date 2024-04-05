import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Pane,
  Paragraph,
  TrashIcon,
} from "evergreen-ui";

import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import SignalementList from "@/components/signalement/signalement-list";
import { useRouter } from "next/router";
import ProtectedPage from "@/layouts/protected-page";
import {
  ExistingNumero,
  Signalement,
  DefaultService as SignalementService,
} from "@/lib/openapi-signalement";
import { toaster } from "evergreen-ui";
import MarkersContext from "@/contexts/markers";
import { getSignalementLabel } from "@/lib/utils/signalement";

function SignalementsPage({ baseLocale, signalements: initialSignalements }) {
  const [signalements, setSignalements] =
    useState<Signalement[]>(initialSignalements);
  const [selectedSignalements, setSelectedSignalements] = useState<string[]>(
    []
  );
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const router = useRouter();
  const { addMarker, disableMarkers } = useContext(MarkersContext);

  useEffect(() => {
    const markerPositions = signalements
      .reduce((acc, cur) => {
        let position;
        if (cur.type === Signalement.type.LOCATION_TO_CREATE) {
          position = cur.changesRequested?.positions[0]?.point;
        } else {
          position = (cur.existingLocation as ExistingNumero).position?.point;
        }

        return [
          ...acc,
          {
            signalementId: cur._id,
            label: getSignalementLabel(cur, { withoutDate: true }),
            position: position,
          },
        ];
      }, [])
      .filter((signalement) => signalement.position)
      .map(({ position, signalementId, label }) => {
        return {
          isMapMarker: true,
          label,
          longitude: position.coordinates[0],
          latitude: position.coordinates[1],
          color: "warning",
          onClick: () => {
            handleSelectSignalement(signalementId);
          },
        };
      });

    markerPositions.forEach((position) => {
      addMarker(position);
    });

    return () => {
      disableMarkers();
    };
  }, [signalements]);

  const updateSignalements = async () => {
    const signalements = await SignalementService.getSignalementsByCodeCommune(
      baseLocale.commune
    );
    setSignalements(signalements);
  };

  const handleSelectSignalement = (id) => {
    router.push(`/bal/${router.query.balId}/signalements/${id}`);
  };

  const handleIgnoreSignalement = async (id) => {
    try {
      await SignalementService.updateSignalement({ id });
      toaster.success("Le signalement a bien été ignoré");
    } catch (error) {
      toaster.danger("Une erreur est survenue", {
        description: error.message,
      });
    }

    await updateSignalements();
  };

  const handleIgnoreSignalements = async () => {
    try {
      for (const id of selectedSignalements) {
        await SignalementService.updateSignalement({ id });
      }
      toaster.success("Les signalements ont bien été ignorés");
    } catch (error) {
      toaster.danger("Une erreur est survenue", {
        description: error.message,
      });
    }

    await updateSignalements();
  };

  const handleToggleSelect = (ids: string[]) => {
    if (ids.length === signalements.length) {
      setSelectedSignalements(ids);
    } else if (ids.length === 0) {
      setSelectedSignalements([]);
    } else {
      for (const id of ids) {
        if (!selectedSignalements.includes(id)) {
          setSelectedSignalements([...selectedSignalements, id]);
        } else {
          setSelectedSignalements(selectedSignalements.filter((s) => s !== id));
        }
      }
    }
  };

  return (
    <ProtectedPage>
      <Pane
        display="flex"
        flexDirection="column"
        background="tint1"
        padding={16}
      >
        <Heading>
          <Pane marginBottom={8} display="flex" justifyContent="space-between">
            <Pane>Signalements</Pane>
          </Pane>
        </Heading>
      </Pane>

      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {selectedSignalements.length > 1 && (
          <Pane padding={16}>
            <Pane marginBottom={5}>
              <Heading>Actions groupées</Heading>
            </Pane>
            <Pane>
              <Dialog
                isShown={showWarningDialog}
                intent="success"
                title="Confirmer l'action groupée"
                hasFooter={false}
                onCloseComplete={() => setShowWarningDialog(false)}
              >
                <Pane marginX="-32px" marginBottom="-8px">
                  <Paragraph marginBottom={8} marginLeft={32} color="muted">
                    Êtes-vous sûr de vouloir ignorer ces signalements ?
                  </Paragraph>
                </Pane>

                <Pane display="flex" justifyContent="flex-end">
                  <Button
                    marginRight={16}
                    appearance="primary"
                    onClick={async () => {
                      await handleIgnoreSignalements();
                      setShowWarningDialog(false);
                    }}
                  >
                    Confirmer
                  </Button>
                  <Button
                    appearance="default"
                    onClick={() => setShowWarningDialog(false)}
                  >
                    Annuler
                  </Button>
                </Pane>
              </Dialog>
              <Button
                marginLeft={16}
                iconBefore={TrashIcon}
                intent="danger"
                onClick={() => setShowWarningDialog(true)}
              >
                Ignorer les signalements
              </Button>
            </Pane>
          </Pane>
        )}
        <SignalementList
          signalements={signalements}
          selectedSignalements={selectedSignalements}
          onSelect={handleSelectSignalement}
          onToggleSelect={handleToggleSelect}
          onIgnore={handleIgnoreSignalement}
        />
      </Pane>
    </ProtectedPage>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);

    const signalements = await SignalementService.getSignalementsByCodeCommune(
      baseLocale.commune
    );

    return {
      props: {
        baseLocale,
        commune,
        voies,
        toponymes,
        signalements,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default SignalementsPage;
