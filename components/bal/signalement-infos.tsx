import React, { useContext } from "react";
import { Pane } from "evergreen-ui";
import SignalementContext from "@/contexts/signalement";

function SignalementInfos() {
  const { signalements } = useContext(SignalementContext);
  return <Pane>Vous avez {signalements.length} signalements</Pane>;
}

export default SignalementInfos;
