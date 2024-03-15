import React, { useContext, useEffect, useState } from "react";
import { Heading, Pane } from "evergreen-ui";

import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import SignalementList from "@/components/signalement/signalement-list";
import { useRouter } from "next/router";
import ProtectedPage from "@/layouts/protected-page";
import { SignalementService } from "@/lib/openapi";
import { toaster } from "evergreen-ui";
import MarkersContext from "@/contexts/markers";
import { Signalement, SignalementTypeEnum } from "@/lib/api-signalement/types";
import { getSignalementLabel } from "@/lib/utils/signalement";

function SignalementsPage({ baseLocale, signalements: initialSignalements }) {
  const [signalements, setSignalements] =
    useState<Signalement[]>(initialSignalements);
  const [selectedSignalements, setSelectedSignalements] = useState<string[]>(
    []
  );
  const router = useRouter();
  const { addMarker, disableMarkers } = useContext(MarkersContext);

  useEffect(() => {
    const markerPositions = signalements
      .reduce((acc, cur) => {
        let position;
        if (cur.type === SignalementTypeEnum.LOCATION_TO_CREATE) {
          position = cur.changesRequested?.positions[0]?.position;
        } else {
          position = cur.existingLocation.position;
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
    const signalements = await SignalementService.getSignalements(
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

    const signalements = await SignalementService.getSignalements(
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
      error: {
        statusCode: 404,
      },
    };
  }
}

export default SignalementsPage;
