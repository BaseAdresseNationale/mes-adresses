import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Pane,
  Heading,
  Table,
  Button,
  Alert,
  AddIcon,
  LockIcon,
  Link,
  Text,
} from "evergreen-ui";

import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

import useHelp from "@/hooks/help";
import useFuse from "@/hooks/fuse";
import useFormState from "@/hooks/useFormState";
import NextLink from "next/link";
import NumeroEditor from "@/components/bal/numero-editor";
import ToponymeNumeros from "@/components/toponyme/toponyme-numeros";
import AddNumeros from "@/components/toponyme/add-numeros";
import ToponymeHeading from "@/components/toponyme/toponyme-heading";
import BALRecoveryContext from "@/contexts/bal-recovery";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  ExtentedToponymeDTO,
  Numero,
  ToponymesService,
  UpdateBatchNumeroDTO,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import SearchPaginationContext from "@/contexts/search-pagination";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { getLinkWithPagination } from "@/hooks/search-pagination";
import { getCommuneWithBBox } from "@/lib/commune";

interface ToponymeNumerosListPageProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
  toponyme: ExtentedToponymeDTO;
}

const fuseOptions = {
  keys: ["numero"],
};

function ToponymeNumerosListPage({
  baseLocale,
  commune,
  toponyme,
}: ToponymeNumerosListPageProps) {
  const { isFormOpen, handleEditing, editedNumero, reset } = useFormState();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { token } = useContext(TokenContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { pushToast, setBreadcrumbs } = useContext(LayoutContext);
  const { savedSearchPagination, setLastSelectedItem } = useContext(
    SearchPaginationContext
  );
  const { reloadNumeros, isEditing, setIsEditing, numeros } =
    useContext(BalDataContext);

  useHelp(2);
  const [filtered, setFilter] = useFuse(numeros, 200, fuseOptions);

  const onAdd = async (numeros: string[]) => {
    setIsLoading(true);

    try {
      const payload: UpdateBatchNumeroDTO = {
        numerosIds: numeros,
        changes: { toponymeId: toponyme.id },
      };
      await BasesLocalesService.updateNumeros(baseLocale.id, payload);
      await reloadNumeros();
      pushToast({
        title: "Les numéros ont bien été modifiés",
        intent: "success",
      });
    } catch (error: unknown) {
      setError((error as any).message);
    }

    setIsLoading(false);
    reset();

    setIsEditing(false);
  };

  const onEnableAdding = () => {
    handleEditing();
    setIsEditing(true);
  };

  const onCancel = useCallback(() => {
    if (isFormOpen) {
      setIsEditing(false);
    }

    reset();
    setError(null);
  }, [isFormOpen, reset, setIsEditing]);

  useEffect(() => {
    return () => {
      setIsEditing(false);
    };
  }, [setIsEditing]);

  // Load protected fields (ex: 'comment')
  useEffect(() => {
    if (token) {
      reloadNumeros();
    }
  }, [token, reloadNumeros]);

  useEffect(() => {
    setLastSelectedItem((prev) => ({
      ...prev,
      [TabsEnum.TOPONYMES]: toponyme.id,
    }));
    setBreadcrumbs(
      <>
        <Link
          is={NextLink}
          href={getLinkWithPagination(
            `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}`,
            savedSearchPagination[TabsEnum.TOPONYMES]
          )}
        >
          Toponymes
        </Link>
        <Text color="muted">{" > "}</Text>
        <Link
          is={NextLink}
          href={`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${toponyme.id}`}
        >
          {toponyme.nom}
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">Liste des numéros</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [
    setBreadcrumbs,
    baseLocale.id,
    toponyme,
    setLastSelectedItem,
    savedSearchPagination,
  ]);

  return (
    <>
      <ToponymeHeading toponyme={toponyme} baseLocale={baseLocale} />
      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {editedNumero && (
          <NumeroEditor
            initialValue={editedNumero}
            commune={commune}
            closeForm={onCancel}
          />
        )}

        {token && isFormOpen && isEditing && !editedNumero ? (
          <AddNumeros
            isLoading={isLoading}
            onSubmit={onAdd}
            onCancel={onCancel}
          />
        ) : (
          <Pane
            flexShrink={0}
            elevation={0}
            backgroundColor="white"
            padding={16}
            display="flex"
            alignItems="center"
            minHeight={64}
          >
            <Heading>Liste des numéros</Heading>
            <Pane marginLeft="auto">
              <Button
                iconBefore={token ? AddIcon : LockIcon}
                appearance="primary"
                intent="success"
                disabled={token && isEditing}
                onClick={
                  token
                    ? onEnableAdding
                    : () => {
                        setIsRecoveryDisplayed(true);
                      }
                }
              >
                Associer des numéros
              </Button>
            </Pane>
          </Pane>
        )}

        {error && (
          <Alert marginY={5} intent="danger" title="Erreur">
            {error}
          </Alert>
        )}

        <Pane flex={1} overflowY="scroll">
          <Table>
            {!isEditing && (
              <Table.Head>
                <Table.SearchHeaderCell
                  placeholder="Rechercher un numéro"
                  onChange={setFilter}
                />
              </Table.Head>
            )}

            {filtered.length === 0 && (
              <Table.Row>
                <Table.TextCell color="muted" fontStyle="italic">
                  Aucun numéro
                </Table.TextCell>
              </Table.Row>
            )}

            <ToponymeNumeros
              numeros={filtered}
              handleSelect={handleEditing}
              isEditable={token && !isEditing}
            />
          </Table>
        </Pane>
      </Pane>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { idToponyme, balId }: { idToponyme: string; balId: string } = params;
  try {
    const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);
    const toponyme: ExtentedToponymeDTO =
      await ToponymesService.findToponyme(idToponyme);
    const numeros: Numero[] =
      await ToponymesService.findToponymeNumeros(idToponyme);

    return {
      props: {
        baseLocale,
        toponyme,
        numeros,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default ToponymeNumerosListPage;
