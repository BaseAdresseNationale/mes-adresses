import { ParcelleFeature, useCadastreSearch } from "@/hooks/cadastre-search";
import { Pane, SearchInput, Text } from "evergreen-ui";
import { useContext, useEffect, useState } from "react";
import style from "./cadastre-search-input.module.css";
import MapContext from "@/contexts/map";
import bbox from "@turf/bbox";
import { LngLatBoundsLike } from "react-map-gl/maplibre";
import { AllGeoJSON } from "@turf/helpers";

interface CadastreSearchInputProps {
  codeCommune: string;
  visible?: boolean;
}

function CadastreSearchInput({
  codeCommune,
  visible,
}: CadastreSearchInputProps) {
  const { filteredParcelles, setFilteredParcelles } =
    useCadastreSearch(codeCommune);
  const { map } = useContext(MapContext);

  const [search, setSearch] = useState("");
  const [hasFocus, setHasFocus] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setFilteredParcelles(search);
    setSelectedIndex(-1);
  }, [search, setFilteredParcelles]);

  const handleSelectParcelle = (parcelle: ParcelleFeature) => {
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

    setHasFocus(false);
    setSearch(parcelle.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!search || !hasFocus || filteredParcelles.length === 0) {
      return;
    }

    const maxIndex = Math.min(filteredParcelles.length, 10) - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex <= maxIndex) {
          handleSelectParcelle(filteredParcelles[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setHasFocus(false);
        setSelectedIndex(-1);
        break;
    }
  };

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
      {search && hasFocus && (
        <>
          <Pane className={style.overlay} onClick={() => setHasFocus(false)} />
          <Pane
            overflow="hidden"
            position="absolute"
            bottom={0}
            transform="translateY(-32px)"
            width="100%"
            zIndex={1}
            maxHeight={200}
            overflowY="auto"
            background="white"
            borderTopLeftRadius={3}
            borderTopRightRadius={3}
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          >
            {filteredParcelles.length === 0 ? (
              <Pane padding={8}>
                <Text color="muted">
                  Aucune parcelle ne correspond à votre recherche
                </Text>
              </Pane>
            ) : (
              filteredParcelles.slice(0, 10).map((parcelle, index) => (
                <button
                  key={parcelle.id}
                  className={`${style.parcelleBtn} ${
                    selectedIndex === index ? style.selected : ""
                  }`}
                  onClick={() => handleSelectParcelle(parcelle)}
                  tabIndex={-1}
                >
                  {parcelle.id}
                </button>
              ))
            )}
          </Pane>
        </>
      )}
      <SearchInput
        width="100%"
        placeholder="Rechercher une parcelle"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        onFocus={() => setHasFocus(true)}
        onKeyDown={handleKeyDown}
      />
    </Pane>
  );
}

export default CadastreSearchInput;
