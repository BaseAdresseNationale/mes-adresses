import { useContext } from "react";
import { Pane, Text, WarningSignIcon, Button } from "evergreen-ui";

import LayoutContext from "@/contexts/layout";
import BALRecoveryContext from "@/contexts/bal-recovery";

function ReadonlyWarning() {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { isMobile } = useContext(LayoutContext);

  return (
    <Pane
      width="100%"
      textAlign="center"
      backgroundColor="orange"
      position="fixed"
      bottom={0}
      height={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <WarningSignIcon
        size={20}
        marginX=".5em"
        style={{ verticalAlign: "sub" }}
      />
      <Text fontSize={isMobile ? 10 : 14}>
        Vous êtes en mode consultation, vous ne pouvez pas modifier cette Base
        Adresse Locale
      </Text>
      <Button
        height={24}
        marginX=".5em"
        width="fit-content"
        onClick={() => {
          setIsRecoveryDisplayed(true);
        }}
      >
        Récupérer mes accès
      </Button>
    </Pane>
  );
}

export default ReadonlyWarning;
