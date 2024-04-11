import React, {
  useMemo,
  useCallback,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Marker } from "react-map-gl";
import { NextRouter, useRouter } from "next/router";
import { Pane, Text, Menu, TrashIcon } from "evergreen-ui";
import { css } from "glamor";

import MarkersContext from "@/contexts/markers";
import BalDataContext from "@/contexts/bal-data";

import useError from "@/hooks/error";
import { ExtentedToponymeDTO, ToponymesService } from "@/lib/openapi";

interface ToponymeMarkerProps {
  initialToponyme: ExtentedToponymeDTO;
  isContextMenuDisplayed: boolean;
  setIsContextMenuDisplayed: Dispatch<SetStateAction<string>>;
}

function ToponymeMarker({
  initialToponyme,
  isContextMenuDisplayed,
  setIsContextMenuDisplayed,
}: ToponymeMarkerProps) {
  const [setError] = useError();
  const router: NextRouter = useRouter();

  const balId: string = router.query.balId as string;

  const { markers } = useContext(MarkersContext);
  const {
    editingId,
    setEditingId,
    isEditing,
    reloadToponymes,
    reloadParcelles,
    voie,
    toponyme,
  } = useContext(BalDataContext);

  const onEnableEditing = useCallback(
    (e) => {
      e.stopPropagation();

      if (!isEditing) {
        if (voie || initialToponyme !== toponyme) {
          router.push(`/bal/${balId}/toponymes/${initialToponyme._id}`);
        }

        if (!voie && initialToponyme._id === toponyme?._id) {
          setEditingId(toponyme._id);
        }
      }
    },
    [isEditing, setEditingId, voie, balId, initialToponyme, router, toponyme]
  );

  const position =
    initialToponyme.positions.find((position) => position.type === "segment") ||
    initialToponyme.positions[0];

  const markerStyle = useMemo(
    () =>
      css({
        borderRadius: 20,
        marginTop: -10,
        marginLeft: -10,
        color: "transparent",
        whiteSpace: "nowrap",
        background: "rgba(0, 0, 0, 0.5)",
        cursor: "pointer",

        "& > span": {
          display: "inline-block",
        },
      }),
    []
  );

  const deleteToponyme = async () => {
    const id: string = initialToponyme._id;

    try {
      await ToponymesService.softDeleteToponyme(id);
      await reloadToponymes();
      await reloadParcelles();

      if (id === toponyme?._id) {
        return router.push(`/bal/${balId}`);
      }
    } catch (error) {
      setError(error.message);
    }

    setIsContextMenuDisplayed(null);
  };

  if (!position) {
    return null;
  }

  if (markers.length > 0 && editingId === initialToponyme._id) {
    return null;
  }

  const { coordinates } = position.point;

  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]}>
      <Pane
        {...markerStyle}
        onClick={onEnableEditing}
        onContextMenu={() => setIsContextMenuDisplayed(initialToponyme._id)}
      >
        <Text color="white" paddingLeft={8} paddingRight={10}>
          {initialToponyme.nom}
        </Text>
      </Pane>

      {isContextMenuDisplayed && (
        <Pane background="tint1" position="absolute" margin={10}>
          <Menu>
            <Menu.Group>
              <Menu.Item
                icon={TrashIcon}
                intent="danger"
                onSelect={deleteToponyme}
              >
                Supprimer
              </Menu.Item>
            </Menu.Group>
          </Menu>
        </Pane>
      )}
    </Marker>
  );
}

export default React.memo(ToponymeMarker);
