import LocalStorageContext from "@/contexts/local-storage";
import { useContext } from "react";
import Joyride from "react-joyride";

const locale = {
  skip: "Passer",
  next: "Suivant",
  back: "Précédent",
  last: "Terminer",
  close: "Fermer",
};

const styles = {
  buttonNext: {
    background: "#3366FF",
    color: "white",
    fontSize: 12,
  },
  buttonSkip: {
    fontSize: 12,
    color: "#696f8c",
  },
  buttonBack: {
    fontSize: 12,
    color: "#3366FF",
  },
  buttonLast: {
    background: "#3366FF",
    color: "white",
    fontSize: 12,
  },
};

interface ProductTourProps {
  localStorageKey: string;
  steps: {
    target: string;
    content: React.ReactNode;
    spotlightPadding?: number;
    placement?: string;
    callback?: () => void;
  }[];
}

export default function ProductTour({
  steps,
  localStorageKey,
}: ProductTourProps) {
  const { productTour, setProductTour } = useContext(LocalStorageContext);
  const isHidden = productTour && productTour[localStorageKey];

  return isHidden ? null : (
    <Joyride
      steps={steps as any}
      run
      continuous
      showSkipButton
      locale={locale}
      styles={styles}
      callback={(e) => {
        if (
          e.action === "close" ||
          e.action === "skip" ||
          e.status === "finished"
        ) {
          setProductTour({ ...productTour, [localStorageKey]: true });
        } else if (e.action === "next") {
          steps[e.index].callback?.();
        }
      }}
    />
  );
}
