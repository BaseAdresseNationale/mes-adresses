import React, { useContext } from "react";
import { Card, Pane, PlusIcon, UndoIcon } from "evergreen-ui";
import BALRecoveryContext from "@/contexts/bal-recovery";
import ButtonCircleEffect from "../button-circle-effect";
import { useRouter } from "next/navigation";

function CreateBaseLocaleCard() {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const router = useRouter();

  return (
    <Card
      flexShrink={0}
      width={290}
      height={400}
      border
      elevation={2}
      margin={12}
      display="flex"
      flexDirection="column"
    >
      <ButtonCircleEffect
        label="Créer une base adresse locale"
        onClick={() => router.push("/new")}
        icon={PlusIcon}
      />
      <Pane borderTop="1px solid #E6E8F0" />
      <ButtonCircleEffect
        label="Récupérer une base adresse locale"
        onClick={() => setIsRecoveryDisplayed(true)}
        icon={UndoIcon}
      />
    </Card>
  );
}

export default CreateBaseLocaleCard;
