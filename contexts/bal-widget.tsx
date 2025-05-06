import { ApiBalAdminService } from "@/lib/bal-admin";
import { Pane } from "evergreen-ui";
import { useRouter } from "next/router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import LayoutContext from "./layout";

interface BALWidgetContextType {
  open: () => void;
  close: () => void;
  navigate: (to: string) => void;
  showWidget: () => void;
  hideWidget: () => void;
  isBalWidgetOpen: boolean;
  isBalWidgetReady: boolean;
  isWidgetVisible: boolean;
}

export const BALWidgetContext = createContext({
  open: () => {},
  close: () => {},
  navigate: (to: string) => {},
  showWidget: () => {},
  hideWidget: () => {},
  isBalWidgetOpen: false,
  isBalWidgetReady: false,
  isWidgetVisible: true,
} as BALWidgetContextType);

interface BALWidgetProviderProps {
  children: React.ReactNode;
}

const visibleOnPages = ["/", "/new", "/accessibilite", "/mentions-legales"];

export function BALWidgetProvider({ children }: BALWidgetProviderProps) {
  const balWidgetRef = useRef<HTMLIFrameElement>(null);
  const transitionTimeout = useRef<NodeJS.Timeout>();
  const [isWidgetDisplayed, setIsWidgetDisplayed] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [isBalWidgetOpen, setIsBalWidgetOpen] = useState(false);
  const [isBalWidgetReady, setIsBalWidgetReady] = useState(false);
  const [isBalWidgetConfigLoaded, setIsBalWidgetConfigLoaded] = useState(false);
  const [balWidgetConfig, setBalWidgetConfig] = useState(null);
  const router = useRouter();
  const { isMobile } = useContext(LayoutContext);

  useEffect(() => {
    const showWidget = visibleOnPages.includes(router.pathname);
    setIsWidgetVisible(showWidget);
  }, [router]);

  const open = useCallback(() => {
    if (balWidgetRef.current) {
      balWidgetRef.current.contentWindow?.postMessage(
        {
          type: "BAL_WIDGET_OPEN",
        },
        "*"
      );
    }
  }, [balWidgetRef]);

  const close = useCallback(() => {
    if (balWidgetRef.current) {
      balWidgetRef.current.contentWindow?.postMessage(
        {
          type: "BAL_WIDGET_CLOSE",
        },
        "*"
      );
    }
  }, [balWidgetRef]);

  const navigate = useCallback(
    (to: string) => {
      if (balWidgetRef.current) {
        balWidgetRef.current.contentWindow?.postMessage(
          {
            type: "BAL_WIDGET_NAVIGATE",
            content: to,
          },
          "*"
        );
      }
    },
    [balWidgetRef]
  );

  // Fetch BAL widget config
  useEffect(() => {
    async function fetchBalWidgetConfig() {
      try {
        const data = await ApiBalAdminService.getBALWidgetConfig();

        setBalWidgetConfig(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBalWidgetConfig();
  }, []);

  // Send config to BAL widget
  // once it's ready
  useEffect(() => {
    if (
      balWidgetRef.current &&
      balWidgetConfig &&
      isBalWidgetReady &&
      !isBalWidgetConfigLoaded
    ) {
      balWidgetRef.current.contentWindow?.postMessage(
        {
          type: "BAL_WIDGET_CONFIG",
          content: balWidgetConfig,
        },
        "*"
      );
    }
  }, [
    balWidgetRef,
    balWidgetConfig,
    isBalWidgetReady,
    isBalWidgetConfigLoaded,
  ]);

  useEffect(() => {
    function BALWidgetMessageHandler(event: {
      data: { type: string; content: any };
    }) {
      switch (event.data?.type) {
        case "BAL_WIDGET_OPENED":
          if (transitionTimeout.current) {
            clearTimeout(transitionTimeout.current);
          }
          setIsBalWidgetOpen(true);
          break;
        case "BAL_WIDGET_CLOSED":
          // Wait for transition to end before closing the iframe
          if (transitionTimeout.current) {
            clearTimeout(transitionTimeout.current);
          }
          transitionTimeout.current = setTimeout(() => {
            setIsBalWidgetOpen(false);
          }, 300);
          break;
        case "BAL_WIDGET_READY":
          setIsBalWidgetReady(true);
          break;
        case "BAL_WIDGET_CONFIG_LOADED":
          setIsBalWidgetConfigLoaded(true);
          break;
        case "BAL_WIDGET_PARENT_NAVIGATE_TO":
          window.open(event.data.content.href, event.data.content.target);
          break;
        default:
          break;
      }
    }

    window.addEventListener("message", BALWidgetMessageHandler);
    setIsWidgetDisplayed(true);

    return () => {
      window.removeEventListener("message", BALWidgetMessageHandler);
      clearTimeout(transitionTimeout.current);
    };
  }, [isBalWidgetOpen]);

  return (
    <BALWidgetContext.Provider
      value={{
        open,
        close,
        navigate,
        showWidget: () => setIsWidgetVisible(true),
        hideWidget: () => setIsWidgetVisible(false),
        isBalWidgetOpen,
        isBalWidgetReady,
        isWidgetVisible,
      }}
    >
      {children}
      {isWidgetDisplayed && (
        <Pane
          is="iframe"
          ref={balWidgetRef}
          src={process.env.NEXT_PUBLIC_BAL_WIDGET_URL}
          title="BAL Widget"
          position="fixed"
          bottom={40}
          right={40}
          zIndex={999}
          border="none"
          height={isBalWidgetOpen ? "600px" : "60px"}
          width={isBalWidgetOpen ? "450px" : "60px"}
          transform={isWidgetVisible ? "translateX(0)" : "translateX(300%)"}
          transition="transform 0.3s ease"
          {...(isMobile && {
            bottom: 10,
            right: 10,
            width: isBalWidgetOpen ? "calc(100% - 20px)" : "60px",
          })}
        />
      )}
    </BALWidgetContext.Provider>
  );
}

export const BALWidgetConsumer = BALWidgetContext.Consumer;

export default BALWidgetContext;
