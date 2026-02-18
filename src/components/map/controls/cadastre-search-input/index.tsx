import { Pane } from "evergreen-ui";
import { useCallback, useContext } from "react";
import style from "./cadastre-search-input.module.css";
import MapContext from "@/contexts/map";
import bbox from "@turf/bbox";
import { LngLatBoundsLike } from "react-map-gl/maplibre";
import { AllGeoJSON } from "@turf/helpers";
import AutocompleteInput, { SearchItemType } from "@/components/autocomplete";
import { ParcelleFeature, useCadastreSearch } from "@/hooks/cadastre-search";

interface CadastreSearchInputProps {
  codeCommune: string;
  visible?: boolean;
}

function CadastreSearchInput({
  codeCommune,
  visible,
}: CadastreSearchInputProps) {
  const { map } = useContext(MapContext);
  const { handleSearchParcelle } = useCadastreSearch(codeCommune);

  const handleSelectParcelle = useCallback(
    (parcelle: SearchItemType<ParcelleFeature>) => {
      if (!map || !parcelle || !parcelle.geometry) {
        return;
      }

      const parcelleBbox = bbox(parcelle.geometry as AllGeoJSON);
      const center = [
        (parcelleBbox[0] + parcelleBbox[2]) / 2,
        (parcelleBbox[1] + parcelleBbox[3]) / 2,
      ] as [number, number];
      const camera = map.cameraForBounds(parcelleBbox as LngLatBoundsLike, {
        padding: 100,
      });
      map.flyTo({
        center,
        offset: [0, 0],
        zoom: camera.zoom,
        screenSpeed: 2,
      });
    },
    [map]
  );

  return (
    <Pane
      className={
        style.cadastreSearchInput +
        " " +
        (visible ? style.visible : style.hidden)
      }
      position="relative"
      height={32}
      cursor="default"
    >
      <AutocompleteInput
        onSearch={handleSearchParcelle}
        onSelect={handleSelectParcelle}
        placeholder="Rechercher une parcelle"
        width="100%"
      />
    </Pane>
  );
}

export default CadastreSearchInput;
