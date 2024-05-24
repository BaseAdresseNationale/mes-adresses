import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Dialog,
  Heading,
  Pane,
  Paragraph,
  Tab,
  Tablist,
  TrashIcon,
  Text,
} from "evergreen-ui";

import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import SignalementList from "@/components/signalement/signalement-list";
import { useRouter } from "next/router";
import ProtectedPage from "@/layouts/protected-page";
import { SignalementsService as SignalementsServiceBal } from "@/lib/openapi-api-bal";
import {
  ExistingNumero,
  NumeroChangesRequestedDTO,
  Signalement,
  SignalementsService,
} from "@/lib/openapi-signalement";
import MarkersContext from "@/contexts/markers";
import { getSignalementLabel } from "@/lib/utils/signalement";
import LayoutContext from "@/contexts/layout";
import SignalementTypeBadge, {
  signalementTypeMap,
} from "@/components/signalement/signalement-type-badge";
import useFuse from "@/hooks/fuse";
import MapContext from "@/contexts/map";
import bbox from "@turf/bbox";

const fuseOptions = {
  keys: ["label"],
};

interface SignalementsPageProps extends BaseEditorProps {
  paginatedSignalements: { data: Signalement[] };
}

const tabs = [
  { label: "En cours", key: "pending" },
  { label: "Archivés", key: "archived" },
];

function SignalementsPage({
  baseLocale,
  commune,
  paginatedSignalements: initialSignalements,
}: SignalementsPageProps) {
  const [signalements, setSignalements] = useState<Signalement[]>(
    initialSignalements.data
  );
  const [selectedSignalements, setSelectedSignalements] = useState<string[]>(
    []
  );
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const router = useRouter();
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { toaster } = useContext(LayoutContext);
  const { showTilesLayers, setShowToponymes, setViewport } =
    useContext(MapContext);
  const [activeTabIndex, setActiveTabIndex] = useState(
    router.query.tab === "archived" ? 1 : 0
  );
  const [filters, setFilters] = useState<{ type: Signalement.type[] }>({
    type: [],
  });

  const fetchSignalements = useCallback(
    async (
      status: Signalement.status[] = [Signalement.status.PENDING],
      types?: Signalement.type[]
    ) => {
      const paginatedSignalements = await SignalementsService.getSignalements(
        100,
        undefined,
        status,
        types,
        undefined,
        [baseLocale.commune]
      );
      setSignalements(paginatedSignalements.data as unknown as Signalement[]);
    },
    [baseLocale.commune]
  );

  // Set viewport to commune
  useEffect(() => {
    const communeBbox: number[] = bbox(commune.contour);
    if (communeBbox) {
      setViewport({
        latitude: (communeBbox[1] + communeBbox[3]) / 2,
        longitude: (communeBbox[0] + communeBbox[2]) / 2,
        zoom: 12,
      });
    }
  }, [commune, setViewport]);

  useEffect(() => {
    showTilesLayers(false);
    setShowToponymes(false);

    return () => {
      showTilesLayers(true);
      setShowToponymes(true);
    };
  }, [showTilesLayers, setShowToponymes]);

  useEffect(() => {
    const status =
      activeTabIndex === 0
        ? [Signalement.status.PENDING]
        : [Signalement.status.IGNORED, Signalement.status.PROCESSED];

    setSelectedSignalements([]);
    fetchSignalements(status, filters.type);
  }, [filters, activeTabIndex, fetchSignalements]);

  const signalementsWithLabel = useMemo(
    () => signalements.map((s) => ({ ...s, label: getSignalementLabel(s) })),
    [signalements]
  );

  const [signalementsList, setSignalementsList] = useFuse(
    signalementsWithLabel,
    200,
    fuseOptions
  );

  const handleSelectSignalement = useCallback(
    (id) => {
      router.push(`/bal/${router.query.balId}/signalements/${id}`);
    },
    [router]
  );

  useEffect(() => {
    const markerPositions = signalementsList
      .reduce(
        (
          acc,
          { id, label, type, changesRequested, existingLocation, status }
        ) => {
          let position;
          if (type === Signalement.type.LOCATION_TO_CREATE) {
            position = (changesRequested as NumeroChangesRequestedDTO)
              ?.positions[0]?.point;
          } else {
            position = (existingLocation as ExistingNumero).position?.point;
          }

          return [
            ...acc,
            {
              signalementId: id,
              status,
              label: (
                <Pane display="flex" flexDirection="column">
                  <SignalementTypeBadge type={type} />
                  <Text marginTop={5}>{label}</Text>
                </Pane>
              ),
              type: type,
              position: position,
            },
          ];
        },
        []
      )
      .filter((signalement) => signalement.position)
      .map(({ position, signalementId, label, type }) => {
        return {
          id: signalementId,
          isMapMarker: true,
          tooltip: label,
          longitude: position.coordinates[0],
          latitude: position.coordinates[1],
          color: signalementTypeMap[type].color,
          onClick: () => {
            handleSelectSignalement(signalementId);
          },
        };
      });

    markerPositions.forEach((position) => {
      addMarker(position);
    });

    return () => {
      disableMarkers();
    };
  }, [signalementsList, handleSelectSignalement]);

  const handleIgnoreSignalement = async (id) => {
    const _updateSignalement = toaster(
      () =>
        SignalementsServiceBal.updateSignalements(baseLocale.id, {
          ids: [id],
          status: Signalement.status.IGNORED,
        }),
      "Le signalement a bien été ignoré",
      "Une erreur est survenue"
    );

    await _updateSignalement();
    await fetchSignalements();
  };

  const handleIgnoreSignalements = async () => {
    const massUpdateSignalements = toaster(
      async () => {
        await SignalementsServiceBal.updateSignalements(baseLocale.id, {
          ids: selectedSignalements,
          status: Signalement.status.IGNORED,
        });
      },
      "Les signalements ont bien été ignorés",
      "Une erreur est survenue"
    );

    await massUpdateSignalements();
    await fetchSignalements();
  };

  const handleToggleSelect = (ids: string[]) => {
    for (const id of ids) {
      if (!selectedSignalements.includes(id)) {
        setSelectedSignalements([...selectedSignalements, id]);
      } else {
        setSelectedSignalements(selectedSignalements.filter((s) => s !== id));
      }
    }
  };

  const handleSelectTab = (index: number) => {
    setActiveTabIndex(index);
    router.replace({
      query: {
        ...router.query,
        tab: tabs[index].key,
      },
    });
  };

  return (
    <ProtectedPage>
      <Pane
        display="flex"
        flexDirection="column"
        background="tint1"
        padding={16}
      >
        <Heading>
          <Pane marginBottom={8} display="flex" justifyContent="space-between">
            <Pane>Signalements</Pane>
          </Pane>
        </Heading>
      </Pane>

      <Tablist margin={10} marginTop={0}>
        {tabs.map(({ label, key }, index) => (
          <Tab
            key={key}
            isSelected={activeTabIndex === index}
            onSelect={() => handleSelectTab(index)}
          >
            {label}
          </Tab>
        ))}
      </Tablist>

      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {selectedSignalements.length > 1 && (
          <Pane padding={16}>
            <Pane marginBottom={5}>
              <Heading>Actions groupées</Heading>
            </Pane>
            <Pane>
              <Dialog
                isShown={showWarningDialog}
                intent="success"
                title="Confirmer l'action groupée"
                hasFooter={false}
                onCloseComplete={() => setShowWarningDialog(false)}
              >
                <Pane marginX="-32px" marginBottom="-8px">
                  <Paragraph marginBottom={8} marginLeft={32} color="muted">
                    Êtes-vous sûr de vouloir ignorer ces signalements ?
                  </Paragraph>
                </Pane>

                <Pane display="flex" justifyContent="flex-end">
                  <Button
                    marginRight={16}
                    appearance="primary"
                    onClick={async () => {
                      await handleIgnoreSignalements();
                      setShowWarningDialog(false);
                    }}
                  >
                    Confirmer
                  </Button>
                  <Button
                    appearance="default"
                    onClick={() => setShowWarningDialog(false)}
                  >
                    Annuler
                  </Button>
                </Pane>
              </Dialog>
              <Button
                marginLeft={16}
                iconBefore={TrashIcon}
                intent="danger"
                onClick={() => setShowWarningDialog(true)}
              >
                Ignorer les signalements
              </Button>
            </Pane>
          </Pane>
        )}
        <SignalementList
          signalements={signalementsList}
          selectedSignalements={selectedSignalements}
          onSelect={handleSelectSignalement}
          setSelectedSignalements={setSelectedSignalements}
          onToggleSelect={handleToggleSelect}
          onIgnore={handleIgnoreSignalement}
          filters={filters}
          setFilters={setFilters}
          onSearch={setSignalementsList}
          editionEnabled={activeTabIndex === 0}
        />
      </Pane>
    </ProtectedPage>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);

    const paginatedSignalements = await SignalementsService.getSignalements(
      100,
      undefined,
      [Signalement.status.PENDING],
      undefined,
      undefined,
      [baseLocale.commune]
    );

    return {
      props: {
        baseLocale,
        commune,
        voies,
        toponymes,
        paginatedSignalements,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default SignalementsPage;
