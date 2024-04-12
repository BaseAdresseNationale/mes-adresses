import { useState, useEffect, useCallback, useRef } from "react";
import { Pane, Spinner } from "evergreen-ui";

const ELEMENT_HEIGHT = 48;
const SPINNER_HEIGHT = ELEMENT_HEIGHT * 0.75;

interface InfiniteScrollListProps {
  items: any[];
  children: (item: any) => JSX.Element;
}

function InfiniteScrollList({ items, children }: InfiniteScrollListProps) {
  const [limit, setLimit] = useState(5);

  const visibleElements = useRef<number>();
  const containerRef = useRef<HTMLDivElement>();
  const scrollPosition = useRef({ target: null, limit });

  const handleScroll = useCallback(({ target }) => {
    const isAtBottom =
      target.scrollHeight - target.scrollTop <=
      target.clientHeight + SPINNER_HEIGHT;

    // Increase limit
    if (isAtBottom) {
      setLimit((limit) => {
        scrollPosition.current = { target, limit };

        return limit + visibleElements.current;
      });
    } else {
      scrollPosition.current = { target, limit: scrollPosition.current.limit };
    }
  }, []);

  useEffect(() => {
    function updateMaxVisibleElements() {
      if (containerRef.current) {
        visibleElements.current = Math.ceil(
          containerRef.current.offsetHeight / ELEMENT_HEIGHT
        );
        setLimit(visibleElements.current);
      }
    }

    const observer = new ResizeObserver(() => updateMaxVisibleElements());
    if (containerRef.current) {
      updateMaxVisibleElements();
      window.addEventListener("resize", updateMaxVisibleElements);
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateMaxVisibleElements);
      observer.disconnect();
    };
  }, []);

  // Restore scroll position when items update
  useEffect(() => {
    const { target, limit } = scrollPosition.current;

    if (target) {
      setLimit(limit);
      target.scroll({ top: target.scrollTop, behavior: "instant" });
      setLimit((limit) => limit + 1); // Prevent spinner to be visible
    }
  }, [items]);

  return (
    <Pane
      ref={containerRef}
      display="flex"
      position="relative"
      flex={1}
      flexDirection="column"
      overflowY="scroll"
      onScroll={handleScroll}
    >
      {items.slice(0, limit).map((numero) => children(numero))}

      {limit < items.length && (
        // Add margin to prevents spin animation to move scrollbar
        <Pane
          display="flex"
          justifyContent="center"
          marginY={SPINNER_HEIGHT / 4}
        >
          <Spinner size={SPINNER_HEIGHT} />
        </Pane>
      )}
    </Pane>
  );
}

export default InfiniteScrollList;
