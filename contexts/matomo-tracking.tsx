import {
  useEffect,
  useState,
  createContext,
  useMemo,
  useCallback,
} from "react";
import { ChildrenProps } from "@/types/context";
import { BaseLocale } from "@/lib/openapi-api-bal";

export enum MatomoEventCategory {
  DOWNLOAD = "Téléchargement",
  DOCUMENT = "Document",
  MAP = "Carte",
  GAMIFICATION = "Gamification",
  BAL_EDITOR = "Éditeur BAL",
  HOME_PAGE = "Page d'accueil",
}

export const MatomoEventAction = {
  [MatomoEventCategory.DOWNLOAD]: {
    DOWNLOAD_BAL_CSV_WITH_COMMENT: "download_bal_csv_with_comment",
    DOWNLOAD_BAL_CSV_WITHOUT_COMMENT: "download_bal_csv_without_comment",
    DOWNLOAD_VOIE_CSV: "download_voie_csv",
    DOWNLOAD_VOIE_GEOJSON: "download_voie_geojson",
  },
  [MatomoEventCategory.DOCUMENT]: {
    GENERATE_CERTIFICAT_NUMEROTAGE: "generate_certificat_numerotage",
    GENERATE_ARRETE_NUMEROTATION_NUMERO: "generate_arrete_numerotation_numero",
    GENERATE_ARRETE_NUMEROTATION_VOIE: "generate_arrete_numerotation_voie",
  },
  [MatomoEventCategory.MAP]: {
    ENABLE_PANORAMAX: "enable_panoramax",
    ENABLE_RULER: "enable_ruler",
    GEOLOCATE_ME: "geolocate_me",
    TAKE_SCREENSHOT: "take_screenshot",
  },
  [MatomoEventCategory.GAMIFICATION]: {
    OPEN_CERTIFICATION_GOAL: "open_certification_goal",
    OPEN_TOPONYME_GOAL: "open_toponyme_goal",
    OPEN_LANGUAGE_GOAL: "open_language_goal",
    IGNORE_GOAL_TOPONYME: "ignore_goal_toponyme",
    IGNORE_GOAL_LANGUAGE: "ignore_goal_language",
  },
  [MatomoEventCategory.BAL_EDITOR]: {
    CONVERT_VOIE_TO_TOPONYME: "convert_voie_to_toponyme",
  },
  [MatomoEventCategory.HOME_PAGE]: {
    SHOW_NEWS: "show_news",
    OPEN_BAL_WIDGET: "open_bal_widget",
    REGISTER_TO_WEBINAIRE: "register_to_webinaire",
  },
};

declare global {
  interface Window {
    Matomo: {
      addTracker: () => void;
    };
    _paq: any[];
  }
}

interface MatomoTrackingContextType {
  matomoTrackEvent: (category: MatomoEventCategory, action: string) => void;
}

const MatomoTrackingContext = createContext<MatomoTrackingContextType | null>(
  null
);

const TRACKING_ENABLED = process.env.NODE_ENV === "production";
const SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
const TRACKER_URL = process.env.NEXT_PUBLIC_MATOMO_TRACKER_URL;

export function MatomoTrackingContextProvider({
  pageProps,
  ...props
}: { pageProps: { baseLocale?: BaseLocale } } & ChildrenProps) {
  const [matomoState, setMatomoState] = useState(null);

  // Load matomo script
  useEffect(() => {
    if (!TRACKING_ENABLED || !SITE_ID || !TRACKER_URL) {
      return;
    }

    const matomoScriptElem = document.createElement("script");
    const firstScriptElem = document.querySelectorAll("script")[0];
    matomoScriptElem.async = true;
    matomoScriptElem.src = `${TRACKER_URL}matomo.js`;
    matomoScriptElem.addEventListener("load", () => {
      setMatomoState("loaded");
    });

    firstScriptElem.parentNode.insertBefore(matomoScriptElem, firstScriptElem);
  }, []);

  // Init matomo tracker with site configuration
  useEffect(() => {
    if (matomoState === "loaded") {
      window.Matomo.addTracker();
      window._paq.push(
        ["setTrackerUrl", `${TRACKER_URL}matomo.php`],
        ["setSiteId", `${SITE_ID}`]
      );
      setMatomoState("initialized");
    }
  }, [matomoState]);

  // Track pages when pageProps change
  useEffect(() => {
    if (matomoState === "initialized") {
      const commune = pageProps?.baseLocale?.commune;
      let urlToTrack = location.href;
      const balEditorPageRe = /\/bal\/.*/;
      const isOnBalEditor = balEditorPageRe.test(location.pathname);
      if (isOnBalEditor) {
        // Prevent the tracker from tracking the bal page and children
        const pageWithTokenPathRE = /\/bal\/[A-Za-z\d]{24}\/[A-Za-z\d]{20}/;
        const isOnTokenRoute = pageWithTokenPathRE.test(location.pathname);
        if (isOnTokenRoute || !commune) {
          return;
        }

        // Replace the balId by the commune code if we are on the bal editor page
        const pathToTrack = location.pathname
          .split("/")
          .map((pathPart, index) => (index === 2 ? commune : pathPart))
          .join("/");
        urlToTrack = `${location.origin}${pathToTrack}`;
      }

      window._paq.push(["setCustomUrl", urlToTrack], ["trackPageView"]);
    }
  }, [matomoState, pageProps]);

  const matomoTrackEvent = useCallback(
    (category: MatomoEventCategory, action: string) => {
      if (matomoState !== "initialized") {
        return;
      }

      const codeCommune = pageProps?.baseLocale?.commune || "";
      const balId = pageProps?.baseLocale?.id || "";

      window._paq.push(["trackEvent", category, action, codeCommune, balId]);
    },
    [matomoState, pageProps]
  );

  const value = useMemo(
    () => ({
      matomoTrackEvent,
    }),
    [matomoTrackEvent]
  );

  return <MatomoTrackingContext.Provider value={value} {...props} />;
}

export default MatomoTrackingContext;
