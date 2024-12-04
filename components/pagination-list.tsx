import { SetStateAction, Dispatch } from "react";
import { Pagination, Pane } from "evergreen-ui";

const LIMIT = 20;

interface PaginationListProps {
  items: any[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  children: (item: any) => JSX.Element;
}

function PaginationList({
  items,
  page,
  setPage,
  children,
}: PaginationListProps) {
  return (
    <Pane
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
        <Pagination
          page={page}
          totalPages={Math.ceil(items?.length / LIMIT)}
          onPageChange={(newPage) => setPage(newPage)}
        ></Pagination>
      )}
    </Pane>
  );
}

export default PaginationList;
