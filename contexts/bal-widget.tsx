import { ApiBalAdminService } from "@/lib/bal-admin";
import { useCallback, useEffect, useRef, useState, createContext } from "react";
import styled, { css } from "styled-components";

export const StyledIFrame = styled.iframe<{
  $isOpen: boolean;
  $isVisible: boolean;
}>`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
  // Fix to avoid white box when dark mode is enabled
  color-scheme: normal;
  border: none;
  ${({ $isOpen }) =>
    $isOpen
      ? css`
          height: 600px;
          width: 450px;
        `
      : css`
          height: 60px;
          width: 60px;
        `}
  ${({ $isVisible }) =>
    $isVisible
      ? css`
          transform: translateX(0);
        `
      : css`
          transform: translateX(300%);
        `}
  transition: transform 0.3s ease;

  @media screen and (max-width: 450px) {
    bottom: 10px;
    right: 10px;
    ${({ $isOpen }) => $isOpen && "width: calc(100% - 20px);"}
  }
`;

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

export function BALWidgetProvider({ children }: BALWidgetProviderProps) {
  const balWidgetRef = useRef<HTMLIFrameElement>(null);
  const transitionTimeout = useRef<NodeJS.Timeout>();
  const [isWidgetDisplayed, setIsWidgetDisplayed] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [isBalWidgetOpen, setIsBalWidgetOpen] = useState(false);
  const [isBalWidgetReady, setIsBalWidgetReady] = useState(false);
  const [isBalWidgetConfigLoaded, setIsBalWidgetConfigLoaded] = useState(false);
  const [balWidgetConfig, setBalWidgetConfig] = useState(null);

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
        <StyledIFrame
          ref={balWidgetRef}
          src={process.env.NEXT_PUBLIC_BAL_WIDGET_URL}
          $isOpen={isBalWidgetOpen}
          $isVisible={isWidgetVisible}
          title="BAL Widget"
        />
      )}
    </BALWidgetContext.Provider>
  );
}

export const BALWidgetConsumer = BALWidgetContext.Consumer;

export default BALWidgetContext;
