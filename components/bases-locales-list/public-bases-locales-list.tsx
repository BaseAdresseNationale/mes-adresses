import Router from "next/router";
import { Pane, Table } from "evergreen-ui";

import BaseLocaleCard from "@/components/base-locale-card";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface PublicBasesLocalesListProps {
  basesLocales: ExtendedBaseLocaleDTO[];
  searchInput: string;
  onFilter: (e: any) => void;
}

function PublicBasesLocalesList({
  basesLocales,
  searchInput,
  onFilter,
}: PublicBasesLocalesListProps) {
  const onBalSelect = (bal) => {
    Router.push(`/bal/${bal.id}`);
  };

  return (
    <Pane borderTop>
      <Table>
        <Table.Head>
          <Table.SearchHeaderCell
            value={searchInput}
            placeholder="Rechercher un code commune"
            onChange={onFilter}
          />
        </Table.Head>
        {basesLocales.length === 0 && (
          <Table.Row>
            <Table.TextCell color="muted" fontStyle="italic">
              Aucun résultat
            </Table.TextCell>
          </Table.Row>
        )}
        <Table.Body background="tint1">
          {basesLocales.map((bal) => (
            <BaseLocaleCard
              key={bal.id}
              baseLocale={bal}
              isDefaultOpen={basesLocales.length === 1}
              onSelect={() => onBalSelect(bal)}
            />
          ))}
        </Table.Body>
      </Table>
    </Pane>
  );
}

export default PublicBasesLocalesList;
