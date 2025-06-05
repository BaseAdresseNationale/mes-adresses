import React, { useContext } from "react";
import WelcomeMessage from "../welcome-message";
import SignalementContext from "@/contexts/signalement";
import LocalStorageContext from "@/contexts/local-storage";
import SignalementProductTour from "../signalement/product-tour/signalement-product-tour";

function ProductTours() {
  const { pendingSignalementsCount } = useContext(SignalementContext);
  const { wasWelcomed } = useContext(LocalStorageContext);

  return (
    <>
      <WelcomeMessage />
      {pendingSignalementsCount > 0 && wasWelcomed && (
        <SignalementProductTour />
      )}
    </>
  );
}

export default ProductTours;
