import React, { useContext } from "react";
import WelcomeMessage from "../welcome-message";
import SignalementContext from "@/contexts/signalement";
import LocalStorageContext from "@/contexts/local-storage";
import SignalementProductTour from "../signalement/product-tour/signalement-product-tour";
import { CommuneType } from "@/types/commune";
import BalDataContext from "@/contexts/bal-data";

function ProductTours({ commune }: { commune: CommuneType }) {
  const { pendingSignalementsCount } = useContext(SignalementContext);
  const { isHabilitationProcessDisplayed } = useContext(BalDataContext);
  const { wasWelcomed } = useContext(LocalStorageContext);

  return (
    <>
      <WelcomeMessage commune={commune} />
      {pendingSignalementsCount > 0 &&
        wasWelcomed &&
        !isHabilitationProcessDisplayed && <SignalementProductTour />}
    </>
  );
}

export default ProductTours;
