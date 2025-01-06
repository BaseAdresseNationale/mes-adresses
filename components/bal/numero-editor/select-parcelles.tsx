import { useContext, useEffect } from "react";
import {
  Pane,
  Button,
  Badge,
  Alert,
  TrashIcon,
  ControlIcon,
  Text,
} from "evergreen-ui";

import ParcellesContext from "@/contexts/parcelles";
import MapContext from "@/contexts/map";

import InputLabel from "@/components/input-label";

interface SelectParcellesProps {
  initialParcelles: string[];
  isToponyme?: boolean;
}

function SelectParcelles({
  initialParcelles = [],
  isToponyme,
}: SelectParcellesProps) {
  const { isCadastreDisplayed, setIsCadastreDisplayed } =
    useContext(MapContext);
  const {
    highlightedParcelles,
    setHighlightedParcelles,
    setIsParcelleSelectionEnabled,
    hoveredParcelles,
    handleHoveredParcelles,
    handleParcelles,
  } = useContext(ParcellesContext);
  const addressType = isToponyme ? "toponyme" : "numéro";

  useEffect(() => {
    setHighlightedParcelles(initialParcelles);
    setIsParcelleSelectionEnabled(true);

    return () => {
      setIsParcelleSelectionEnabled(false);
    };
  }, [setHighlightedParcelles, setIsParcelleSelectionEnabled]);

  return (
    <Pane display="flex" flexDirection="column">
      <InputLabel
        title="Parcelles cadastre"
        help={`Depuis la carte, cliquez sur les parcelles que vous souhaitez ajouter au ${addressType}. En précisant les parcelles associées à cette adresse, vous accélérez sa réutilisation par de nombreux services, DDFiP, opérateurs de courrier, de fibre et de GPS.`}
      />
      {highlightedParcelles.length > 0 ? (
        <Pane display="grid" gridTemplateColumns="1fr 1fr 1fr">
          {highlightedParcelles.map((parcelle) => {
            const isHovered = hoveredParcelles.some(
              ({ id }) => id === parcelle
            );
            return (
              <Badge
                key={parcelle}
                isInteractive
                color={isHovered ? "red" : "green"}
                margin={4}
                onClick={() => handleParcelles([parcelle])}
                onMouseEnter={() => handleHoveredParcelles([parcelle])}
                onMouseLeave={() => handleHoveredParcelles([])}
              >
                {parcelle}
                {isHovered && (
                  <TrashIcon
                    marginLeft={4}
                    size={14}
                    color="danger"
                    verticalAlign="text-bottom"
                  />
                )}
              </Badge>
            );
          })}
        </Pane>
      ) : (
        <Pane>
          <Alert marginTop={8}>
            <Text>
              Depuis la carte, cliquez sur les parcelles que vous souhaitez
              ajouter au {addressType}.
            </Text>
          </Alert>
        </Pane>
      )}

      <Button
        type="button"
        display="flex"
        justifyContent="center"
        marginTop={8}
        iconAfter={ControlIcon}
        onClick={() => setIsCadastreDisplayed(!isCadastreDisplayed)}
      >
        {isCadastreDisplayed ? "Masquer" : "Afficher"} le cadastre
      </Button>
    </Pane>
  );
}

export default SelectParcelles;
