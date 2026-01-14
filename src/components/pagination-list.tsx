import { SetStateAction, Dispatch, JSX } from "react";
import { Pagination, Pane } from "evergreen-ui";

const LIMIT = 20;

interface PaginationListProps {
  id?: string;
  items: any[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  children: (item: any) => JSX.Element;
}

function PaginationList({
  id,
  items,
  page,
  setPage,
  children,
}: PaginationListProps) {
  return (
    <Pane
      id={id}
      display="flex"
      position="relative"
      flex={1}
      flexDirection="column"
      overflowY="scroll"
    >
      {items
        .slice((page - 1) * LIMIT, page * LIMIT)
        .map((numero) => children(numero))}
      {items?.length > LIMIT && (
        <Pane
          position="sticky"
          bottom={0}
          display="flex"
          justifyContent="center"
          background="tint2"
        >
          <Pagination
            page={page}
            totalPages={Math.ceil(items?.length / LIMIT)}
            onPageChange={(newPage) => setPage(newPage)}
            onPreviousPage={() => setPage(page - 1)}
            onNextPage={() => setPage(page + 1)}
          />
        </Pane>
      )}
    </Pane>
  );
}

export default PaginationList;
