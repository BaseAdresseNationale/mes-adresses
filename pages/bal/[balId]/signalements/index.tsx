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
  Badge,
} from "evergreen-ui";
import SignalementList from "@/components/signalement/signalement-list";
import { useRouter } from "next/router";
import ProtectedPage from "@/layouts/protected-page";
import { Signalement, SignalementsService } from "@/lib/openapi-signalement";
import MarkersContext from "@/contexts/markers";
import { getSignalementLabel } from "@/lib/utils/signalement";
import LayoutContext from "@/contexts/layout";
import SignalementTypeBadge, {
  signalementTypeMap,
} from "@/components/signalement/signalement-type-badge";
import useFuse from "@/hooks/fuse";
import MapContext from "@/contexts/map";
import SignalementContext from "@/contexts/signalement";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import BalDataContext from "@/contexts/bal-data";

const fuseOptions = {
  keys: ["label"],
};

interface SignalementsPageProps {
  paginatedSignalements: { data: Signalement[] };
}

function SignalementsPage({
  paginatedSignalements: initialSignalements,
}: SignalementsPageProps) {
  const { commune } = useContext(BalDataContext);
  const [signalements, setSignalements] = useState<Signalement[]>(
    initialSignalements.data
  );
  const {
    pendingSignalementsCount,
    archivedSignalementsCount,
    updateManySignalements,
    fetchPendingSignalements,
    fetchArchivedSignalements,
  } = useContext(SignalementContext);
  const [selectedSignalements, setSelectedSignalements] = useState<string[]>(
    []
  );
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const router = useRouter();
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const { showTilesLayers, setShowToponymes, map, isStyleLoaded } =
    useContext(MapContext);
  const [activeTabIndex, setActiveTabIndex] = useState(
    router.query.tab === "archived" ? 1 : 0
  );
  const [filters, setFilters] = useState<{ type: Signalement.type[] }>({
    type: [],
  });

  const tabs = [
    { label: "En cours", key: "pending", count: pendingSignalementsCount },
    {
      label: `Archivé${archivedSignalementsCount > 1 ? "s" : ""}`,
      key: "archived",
      count: archivedSignalementsCount,
    },
  ];

  useEffect(() => {
    setBreadcrumbs(<Text aria-current="page">Signalements</Text>);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs]);

  // Fly to commune
  useEffect(() => {
    if (!map) {
      return;
    }

    if (commune.bbox) {
      const center = [
        (commune.bbox[0] + commune.bbox[2]) / 2,
        (commune.bbox[1] + commune.bbox[3]) / 2,
      ] as [number, number];
      map.flyTo({
        center,
        offset: [0, 0],
        zoom: 12,
        screenSpeed: 2,
      });
    }
  }, [commune.bbox, map]);

  useEffect(() => {
    if (isStyleLoaded) {
      showTilesLayers(false);
      setShowToponymes(false);
    }

    return () => {
      showTilesLayers(true);
      setShowToponymes(true);
    };
  }, [showTilesLayers, setShowToponymes, isStyleLoaded]);

  useEffect(() => {
    const updateSignalements = async () => {
      setSelectedSignalements([]);
      let signalements;
      if (activeTabIndex === 0) {
        signalements = await fetchPendingSignalements(100, filters.type);
      } else {
        signalements = await fetchArchivedSignalements(100, filters.type);
      }
      setSignalements(signalements);
    };

    updateSignalements();
  }, [
    filters,
    activeTabIndex,
    fetchPendingSignalements,
    fetchArchivedSignalements,
  ]);

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
      .filter((signalement) => signalement.point)
      .map(({ id, point, label, type }) => {
        return {
          id,
          isMapMarker: true,
          tooltip: (
            <Pane display="flex" flexDirection="column">
              <SignalementTypeBadge type={type} />
              <Text marginTop={5}>{label}</Text>
            </Pane>
          ),
          longitude: point.coordinates[0],
          latitude: point.coordinates[1],
          color: signalementTypeMap[type].color,
          onClick: () => {
            handleSelectSignalement(id);
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

  const handleIgnoreSignalements = async (ids: string[]) => {
    const _updateSignalements = toaster(
      () => updateManySignalements(ids, Signalement.status.IGNORED),
      ids.length > 1
        ? "Les signalements ont bien été ignorés"
        : "Le signalement a bien été ignoré",
      "Une erreur est survenue"
    );

    await _updateSignalements();
    const signalements = await fetchPendingSignalements(100, filters.type);
    setSignalements(signalements);
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
      <Tablist background="white" padding={8}>
        {tabs.map(({ label, key, count }, index) => (
          <Tab
            key={key}
            isSelected={activeTabIndex === index}
            onSelect={() => handleSelectTab(index)}
          >
            <Badge color="neutral" marginRight={4}>
              {count}
            </Badge>
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
                      await handleIgnoreSignalements(selectedSignalements);
                      setShowWarningDialog(false);
                      setSelectedSignalements([]);
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
          onIgnore={(id) => handleIgnoreSignalements([id])}
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
    const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);

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
