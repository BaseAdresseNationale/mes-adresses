import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useContext,
} from "react";
import LocalStorageContext from "@/contexts/local-storage";
import type { ViewState } from "react-map-gl/maplibre";
import type { Map as MaplibreMap, VectorTileSource } from "maplibre-gl";
import { ChildrenProps } from "@/types/context";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import { CommuneDTO } from "@/lib/openapi-api-bal";
import { ortho, planIGN, vector } from "@/components/map/styles";
import { cadastreLayers } from "@/components/map/layers/cadastre";
import BalDataContext from "@/contexts/bal-data";

interface MapContextType {
  map: MaplibreMap | null;
  setMap: (value: MaplibreMap | null) => void;
  handleMapRef: (ref: any) => void;
  isTileSourceLoaded: boolean;
  reloadTiles: () => void;
  style: string;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
  mapStyle: any;
  isStyleLoaded: boolean;
  viewport: Partial<ViewState>;
  setViewport: React.Dispatch<React.SetStateAction<Partial<ViewState>>>;
  isCadastreDisplayed: boolean;
  setIsCadastreDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
  balTilesUrl: string;
  isMapLoaded: boolean;
  tileLayersMode: TilesLayerMode;
  setTileLayersMode: React.Dispatch<React.SetStateAction<TilesLayerMode>>;
}

const MapContext = React.createContext<MapContextType | null>(null);

const defaultViewport: Partial<ViewState> = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6,
};

export const BAL_API_URL =
  process.env.NEXT_PUBLIC_BAL_API_URL ||
  "https://api-bal.adresse.data.gouv.fr/v2";

export const SOURCE_TILE_ID = "tiles";

export enum MapStyle {
  ORTHO = "ortho",
  VECTOR = "vector",
  PLAN_IGN = "plan-ign",
}

export const getDefaultStyle = (commune: CommuneDTO) =>
  commune.hasOrtho ? MapStyle.ORTHO : MapStyle.VECTOR;

const LAYERS = [...cadastreLayers];

function getBaseStyle(style: MapStyle) {
  switch (style) {
    case MapStyle.ORTHO:
      return ortho;

    case MapStyle.VECTOR:
      return vector;

    case MapStyle.PLAN_IGN:
      return planIGN;
    default:
      return vector;
  }
}

function generateNewStyle(style) {
  const baseStyle = getBaseStyle(style);
  return baseStyle.updateIn(["layers"], (arr: any[]) => arr.push(...LAYERS));
}

export function MapContextProvider(props: ChildrenProps) {
  const { baseLocale, commune } = useContext(BalDataContext);
  const { userSettings, registeredMapStyle } = useContext(LocalStorageContext);
  const [map, setMap] = useState<MaplibreMap | null>(null);
  const registeredBalMapStyle = registeredMapStyle
    ? registeredMapStyle[baseLocale.id]
    : null;
  const [style, setStyle] = useState<MapStyle>(
    registeredBalMapStyle || getDefaultStyle(commune)
  );
  const [viewport, setViewport] = useState<Partial<ViewState>>(defaultViewport);
  const [isCadastreDisplayed, setIsCadastreDisplayed] =
    useState<boolean>(false);
  const [isTileSourceLoaded, setIsTileSourceLoaded] = useState<boolean>(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [tileLayersMode, setTileLayersMode] = useState<TilesLayerMode>(
    TilesLayerMode.VOIE
  );

  const mapStyle = useMemo(() => generateNewStyle(style), [style]);

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

  const value = useMemo(
    () => ({
      map,
      setMap,
      handleMapRef,
      isTileSourceLoaded,
      reloadTiles,
      style,
      setStyle,
      isStyleLoaded,
      viewport,
      setViewport,
      isCadastreDisplayed,
      setIsCadastreDisplayed,
      balTilesUrl,
      isMapLoaded,
      tileLayersMode,
      setTileLayersMode,
      mapStyle,
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
      tileLayersMode,
      setTileLayersMode,
      mapStyle,
    ]
  );

  return <MapContext.Provider value={value} {...props} />;
}

export const MarkerContextConsumer = MapContext.Consumer;

export default MapContext;
