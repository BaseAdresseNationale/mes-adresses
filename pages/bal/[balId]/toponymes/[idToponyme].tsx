import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Pane,
  Heading,
  Table,
  Button,
  Alert,
  AddIcon,
  LockIcon,
} from "evergreen-ui";

import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

import useHelp from "@/hooks/help";
import useFuse from "@/hooks/fuse";
import useFormState from "@/hooks/useFormState";

import NumeroEditor from "@/components/bal/numero-editor";
import ToponymeNumeros from "@/components/toponyme/toponyme-numeros";
import AddNumeros from "@/components/toponyme/add-numeros";
import ToponymeHeading from "@/components/toponyme/toponyme-heading";
import { CommuneType } from "@/types/commune";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import BALRecoveryContext from "@/contexts/bal-recovery";
import {
  BaseLocale,
  BasesLocalesService,
  ExtentedToponymeDTO,
  NumeroPopulate,
  ToponymesService,
  UpdateBatchNumeroDTO,
} from "@/lib/openapi";

interface ToponymePageProps {
  baseLocale: BaseLocale;
  commune: CommuneType;
}

function ToponymePage({ baseLocale, commune }: ToponymePageProps) {
  const { isFormOpen, handleEditing, editedNumero, reset } = useFormState();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { token } = useContext(TokenContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  const { toponyme, numeros, reloadNumeros, isEditing, setIsEditing } =
    useContext(BalDataContext);

  useHelp(2);
  const [filtered, setFilter] = useFuse(numeros, 200, {
    keys: ["numero"],
  });

  const onAdd = async (numeros) => {
    setIsLoading(true);

    try {
      const payload: UpdateBatchNumeroDTO = {
        numerosIds: numeros,
        changes: { toponyme: toponyme._id },
      };
      await BasesLocalesService.updateNumeros(baseLocale._id, payload);

      await reloadNumeros();
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

  return (
    <>
      <ToponymeHeading toponyme={toponyme} commune={commune} />

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
            hasPreview
            initialVoieId={editedNumero.voie.id}
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
                Ajouter des numéros
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
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);
    const toponyme: ExtentedToponymeDTO =
      await ToponymesService.findToponyme(idToponyme);
    const numeros: NumeroPopulate[] =
      await ToponymesService.findToponymeNumeros(idToponyme);

    return {
      props: {
        baseLocale,
        commune,
        voies,
        toponymes,
        toponyme,
        numeros,
      },
    };
  } catch {
    return {
      error: {
        statusCode: 404,
      },
    };
  }
}

export default ToponymePage;
