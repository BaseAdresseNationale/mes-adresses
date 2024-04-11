import React from "react";
import NextLink from "next/link";
import { Pane, Text, Heading, Link } from "evergreen-ui";
import { Signalement } from "@/lib/openapi-signalement";

interface SignalementInfosProps {
  balId: string;
  signalements: Signalement[];
}

function SignalementInfos({ balId, signalements }: SignalementInfosProps) {
  return (
    <Pane backgroundColor="white" padding={8} borderRadius={10} margin={8}>
      <Heading marginBottom={15}>Signalements</Heading>
      <Text marginTop={5} is="p">
        Vous avez <b>{signalements.length}</b>{" "}
        {signalements.length > 1 ? "signalements" : "signalement"} en attente de
        traitement.
      </Text>
      <Link is={NextLink} href={`/bal/${balId}/signalements`}>
        Consulter les signalements
      </Link>
    </Pane>
  );
}

export default SignalementInfos;
