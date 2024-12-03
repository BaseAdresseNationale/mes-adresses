import { useEffect, forwardRef, MutableRefObject } from "react";
import { Pane, Spinner } from "evergreen-ui";

interface InfiniteScrollListProps {
  items: any[];
  initialScroll?: number;
  children: (item: any) => JSX.Element;
}

const InfiniteScrollList = forwardRef<HTMLDivElement, InfiniteScrollListProps>(
  function InfiniteScrollList(
    { items, initialScroll = 0, children }: InfiniteScrollListProps,
    containerRef: MutableRefObject<HTMLDivElement>
  ) {
    useEffect(() => {
      containerRef?.current.scrollTo({
        top: initialScroll, // Position verticale à atteindre
        behavior: "smooth", // Animation fluide
      });
    }, [containerRef, initialScroll]);

    return (
      <Pane
        ref={containerRef}
        display="flex"
        position="relative"
        flex={1}
        flexDirection="column"
        overflowY="scroll"
      >
        {items.map((numero) => children(numero))}
      </Pane>
    );
  }
);

export default InfiniteScrollList;
