import React, { useState } from "react";
import { Heading, Pane } from "evergreen-ui";

import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import SignalementList from "@/components/signalement/signalement-list";
import { useRouter } from "next/router";
import ProtectedPage from "@/layouts/protected-page";
import { SignalementService } from "@/lib/openapi";

function SignalementsPage({ signalements }) {
  const [selectedSignalements, setSelectedSignalements] = useState<string[]>(
    []
  );
  const router = useRouter();
  const handleSelectSignalement = (id) => {
    router.push(`/bal/${router.query.balId}/signalements/${id}`);
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
          onToggleSelect={(id) => {
            if (selectedSignalements.includes(id)) {
              setSelectedSignalements(
                selectedSignalements.filter((s) => s !== id)
              );
            } else {
              setSelectedSignalements([...selectedSignalements, id]);
            }
          }}
          onIgnore={() => {}}
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
