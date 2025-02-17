import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import {
  Pane,
  Heading,
  Paragraph,
  Button,
  Pagination,
  Spinner,
} from "evergreen-ui";

import { sortBalByUpdate } from "@/lib/utils/sort-bal.ts";

import Main from "@/layouts/main";
import {
  BaseLocale,
  BasesLocalesService,
  PageBaseLocaleDTO,
} from "@/lib/openapi-api-bal";

const LIMIT_BY_PAGE = 20;

interface PublicBasesLocalesListProps {
  basesLocales: BaseLocale[];
  searchInput: string;
  onFilter: (value: string) => void;
}

const CSRPublicBasesLocalesList: React.ComponentType<PublicBasesLocalesListProps> =
  dynamic(
    () =>
      import(
        "../components/bases-locales-list/public-bases-locales-list.tsx"
      ) as any,
    {
      ssr: false,
      loading: () => (
        <Pane
          height="100%"
          display="flex"
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
        </Pane>
      ),
    }
  );

interface AllPageProps {
  basesLocales: BaseLocale[];
  commune: string;
  currentPage: number;
  count: number;
}

function All({ basesLocales, commune, currentPage, count = 0 }: AllPageProps) {
  const router: NextRouter = useRouter();
  const totalPages: number = Math.ceil(count / LIMIT_BY_PAGE);

  const [input, setInput] = useState<string>(commune || "");

  const onFilter = async (value: string) => {
    const query = { page: currentPage, commune: undefined };

    if (value.length > 0) {
      query.commune = value;
    }

    await router.push({ pathname: "/all", query });
  };

  const handlePageChange = async (page: number) => {
    await router.push({
      pathname: "/all",
      query: { page },
    });
  };

  const handleInput = (value: string) => {
    setInput((prev) => {
      const input = value.slice(0, 5);

      if (input !== prev && (input.length === 5 || input.length === 0)) {
        void onFilter(input);
      }

      return input;
    });
  };

  return (
    <Main>
      <Pane padding={16} backgroundColor="white">
        <Heading size={600} marginBottom={8}>
          Rechercher une Base Adresse Locale
        </Heading>
        <Paragraph>
          Sélectionnez une Base Adresse Locale que vous souhaitez visualiser,
          créer ou modifier.
        </Paragraph>
      </Pane>

      <Pane flex={1} overflowY="scroll">
        <CSRPublicBasesLocalesList
          basesLocales={basesLocales}
          searchInput={input}
          onFilter={handleInput}
        />
      </Pane>

      {totalPages > 1 && (
        <Pagination
          marginX="auto"
          page={currentPage}
          totalPages={totalPages}
          onPreviousPage={async () => handlePageChange(currentPage)}
          onPageChange={handlePageChange}
          onNextPage={async () => handlePageChange(currentPage)}
        />
      )}

      <Pane borderTop marginTop="auto" padding={16}>
        <Paragraph size={300} color="muted">
          Vous pouvez également créer une nouvelle Base Adresse Locale.
        </Paragraph>
        <Link legacyBehavior href="/new" passHref>
          <Button marginTop={10} appearance="primary" is="a">
            Créer une nouvelle Base Adresse Locale
          </Button>
        </Link>
      </Pane>
    </Main>
  );
}

All.getInitialProps = async ({ query }) => {
  let result: PageBaseLocaleDTO;
  const currentPage = query.page || 1;

  try {
    result = await BasesLocalesService.searchBaseLocale(
      String(LIMIT_BY_PAGE),
      String((currentPage - 1) * LIMIT_BY_PAGE),
      query.deleted,
      query.commune,
      query.email,
      query.status
    );
  } catch (e) {}

  return {
    basesLocales: result ? sortBalByUpdate(result.results) : [],
    currentPage,
    commune: query.commune || "",
    count: result ? result.count : 0,
  };
};

export default All;
