import { useEffect } from "react";

function useKeyEvent(handler, dependencies = [], event = "keypress") {
  useEffect(() => {
    window.addEventListener(event, handler);

    return () => {
      window.removeEventListener(event, handler);
    };
  }, [event, handler, dependencies]);
}

export default useKeyEvent;
