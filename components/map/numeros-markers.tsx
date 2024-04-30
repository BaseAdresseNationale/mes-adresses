import { Dispatch, SetStateAction, useCallback, useContext } from "react";
import { css } from "glamor";

import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";

import useError from "@/hooks/error";

import NumeroMarker from "@/components/map/numero-marker";
import { Numero, NumerosService } from "@/lib/openapi";
import { toaster } from "evergreen-ui";

interface NumerosMarkersProps {
  numeros: Numero[];
  isContextMenuDisplayed: string;
  setIsContextMenuDisplayed: Dispatch<SetStateAction<string>>;
  color: string;
}

function NumerosMarkers({
  numeros,
  isContextMenuDisplayed,
  setIsContextMenuDisplayed,
  color,
}: NumerosMarkersProps) {
  const [setError] = useError();

  const {
    setEditingId,
    isEditing,
    reloadNumeros,
    reloadParcelles,
    refreshBALSync,
  } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);

  const onEnableMenu = useCallback(
    (numeroId: string) => {
      if (!isEditing) {
        setIsContextMenuDisplayed(numeroId);
      }
    },
    [setIsContextMenuDisplayed, isEditing]
  );

  const onEnableEditing = useCallback(
    (numeroId: string) => {
      if (!isEditing) {
        setEditingId(numeroId);
        setIsContextMenuDisplayed(null);
      }
    },
    [setEditingId, setIsContextMenuDisplayed, isEditing]
  );

  const markerStyle = useCallback(
    (color) =>
      css({
        borderRadius: 20,
        marginTop: -10,
        marginLeft: -10,
        color: "transparent",
        whiteSpace: "nowrap",
        background: "rgba(0, 0, 0, 0.7)",
        cursor: "pointer",

        "&:before": {
          content: " ",
          backgroundColor: color,
          border: "1px solid white",
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          marginLeft: 6,
        },

        "& > span, & > svg": {
          display: "inline-block",
        },
      }),
    []
  );

  const removeAddress = useCallback(
    async (numeroId: string) => {
      try {
        await NumerosService.softDeleteNumero(numeroId);
        await reloadNumeros();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();
        toaster.success("Le numéro a bien été archivé");
      } catch (error) {
        setError(error.message);
        toaster.danger("Le numéro n’a pas pu être archivé", {
          description: error.message,
        });
      }

      setIsContextMenuDisplayed(null);
    },
    [
      reloadNumeros,
      reloadParcelles,
      setError,
      setIsContextMenuDisplayed,
      refreshBALSync,
      reloadTiles,
    ]
  );

  return numeros.map((numero) => (
    <NumeroMarker
      key={numero._id}
      numero={numero}
      style={markerStyle(color)}
      isContextMenuDisplayed={numero._id === isContextMenuDisplayed}
      removeAddress={removeAddress}
      onEnableEditing={onEnableEditing}
      onEnableMenu={onEnableMenu}
    />
  ));
}

export default NumerosMarkers;
