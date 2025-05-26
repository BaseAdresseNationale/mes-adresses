import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useContext,
} from "react";
import BalContext from "@/contexts/bal-data";
import LocalStorageContext from "@/contexts/local-storage";
import type { ViewState } from "react-map-gl/maplibre";
import type { Map as MaplibreMap, VectorTileSource } from "maplibre-gl";
import { ChildrenProps } from "@/types/context";
import { addOverlay } from "carte-facile";

export enum MapStyleEnum {
  ING = "ing",
  OSM = "osm",
  AERIAL = "aerial",
}

interface MapContextType {
  map: MaplibreMap | null;
  setMap: (value: MaplibreMap | null) => void;
  handleMapRef: (ref: any) => void;
  isTileSourceLoaded: boolean;
  reloadTiles: () => void;
  style: MapStyleEnum;
  setStyle: React.Dispatch<React.SetStateAction<MapStyleEnum>>;
  defaultStyle: MapStyleEnum;
  isStyleLoaded: boolean;
  viewport: Partial<ViewState>;
  setViewport: React.Dispatch<React.SetStateAction<Partial<ViewState>>>;
  isCadastreDisplayed: boolean;
  setIsCadastreDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
  balTilesUrl: string;
  isMapLoaded: boolean;
  showTilesLayers: (show?: boolean) => void;
  showToponymes: boolean;
  setShowToponymes: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapContext = React.createContext<MapContextType | null>(null);

const defaultViewport: Partial<ViewState> = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6,
};

export const defaultStyle = MapStyleEnum.OSM;

export const BAL_API_URL =
  process.env.NEXT_PUBLIC_BAL_API_URL ||
  "https://api-bal.adresse.data.gouv.fr/v2";

export const SOURCE_TILE_ID = "tiles";

export function MapContextProvider(props: ChildrenProps) {
  const [map, setMap] = useState<MaplibreMap | null>(null);
  const [showToponymes, setShowToponymes] = useState<boolean>(true);
  const [style, setStyle] = useState<MapStyleEnum>(defaultStyle);
  const [viewport, setViewport] = useState<Partial<ViewState>>(defaultViewport);
  const [isCadastreDisplayed, setIsCadastreDisplayed] =
    useState<boolean>(false);
  const [isTileSourceLoaded, setIsTileSourceLoaded] = useState<boolean>(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const { baseLocale } = useContext(BalContext);
  const { userSettings } = useContext(LocalStorageContext);

  const balTilesUrl = `${BAL_API_URL}/bases-locales/${
    baseLocale.id
  }/tiles/{z}/{x}/{y}.pbf${
    userSettings?.colorblindMode ? "?colorblindMode=true" : ""
  }`;

  useEffect(() => {
    map?.on("load", () => {
      const source = map.getSource(SOURCE_TILE_ID);
      if (source?.loaded()) {
        setIsTileSourceLoaded(true);
      }
      addOverlay(map, "administrativeBoundaries");
    });
  }, [map]);

  // When the map is fully loaded (with the layers), this event is triggered
  map?.on("idle", () => {
    setIsMapLoaded(true);
  });

  const reloadTiles = useCallback(() => {
    if (map && isTileSourceLoaded) {
      const source: VectorTileSource = map.getSource(
        SOURCE_TILE_ID
      ) as VectorTileSource;
      source.setTiles([balTilesUrl]);
    }
  }, [map, isTileSourceLoaded, balTilesUrl]);

  const handleMapRef = useCallback((ref) => {
    if (ref) {
      const map: MaplibreMap = ref.getMap();
      setMap(map);
      map.on("styledataloading", () => {
        setIsStyleLoaded(false);
        void map.once("style.load", () => {
          setIsStyleLoaded(true);
        });
      });
    }
  }, []);

  const showTilesLayers = useCallback(
    (show = true) => {
      if (map && isMapLoaded) {
        const tilesLayers = map
          .getStyle()
          ?.layers.filter((layer) => (layer as any).source === SOURCE_TILE_ID)
          .map((layer) => layer.id);

        tilesLayers?.forEach((layerId) => {
          map.setLayoutProperty(
            layerId,
            "visibility",
            show ? "visible" : "none"
          );
        });
      }
    },
    [map, isMapLoaded]
  );

  const value = useMemo(
    () => ({
      map,
      setMap,
      handleMapRef,
      isTileSourceLoaded,
      reloadTiles,
      style,
      setStyle,
      defaultStyle,
      isStyleLoaded,
      viewport,
      setViewport,
      isCadastreDisplayed,
      setIsCadastreDisplayed,
      balTilesUrl,
      isMapLoaded,
      showTilesLayers,
      showToponymes,
      setShowToponymes,
    }),
    [
      map,
      isTileSourceLoaded,
      reloadTiles,
      handleMapRef,
      isStyleLoaded,
      style,
      viewport,
      isCadastreDisplayed,
      balTilesUrl,
      isMapLoaded,
      showTilesLayers,
      showToponymes,
      setShowToponymes,
    ]
  );

  return <MapContext.Provider value={value} {...props} />;
}

export const MarkerContextConsumer = MapContext.Consumer;

export default MapContext;
