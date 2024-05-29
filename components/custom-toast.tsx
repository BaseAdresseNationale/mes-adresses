import { Pane } from "evergreen-ui";
import { useEffect, useState } from "react";

interface CustomToastProps {
  duration: number;
  children: React.ReactNode;
}

const TRANSITION_DURATION = 300;

function CustomToast({ duration, children }: CustomToastProps) {
  const [top, setTop] = useState(0);

  useEffect(() => {
    setTop(20);

    const timeout = setTimeout(() => {
      setTop(-100);
    }, duration - TRANSITION_DURATION);

    return () => clearTimeout(timeout);
  }, [duration]);

  return (
    <Pane
      position="fixed"
      zIndex={1000}
      left="50%"
      transform="translateX(-50%)"
      top={top}
      transition={`top ${TRANSITION_DURATION}ms`}
    >
      {children}
    </Pane>
  );
}

export default CustomToast;
