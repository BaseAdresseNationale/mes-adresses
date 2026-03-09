import { useContext, useEffect } from "react";
import {
  Pane,
  Button,
  Badge,
  Alert,
  TrashIcon,
  ControlIcon,
  Text,
  defaultTheme,
  UnorderedList,
  ListItem,
} from "evergreen-ui";

import ParcellesContext from "@/contexts/parcelles";
import MapContext from "@/contexts/map";
import CadastreContext from "@/contexts/cadastre";

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
  const { communeParcelles } = useContext(CadastreContext);
  const addressType = isToponyme ? "toponyme" : "numéro";

  const invalidParcelles = highlightedParcelles.filter(
    (p) => communeParcelles.length > 0 && !communeParcelles.includes(p)
  );

  useEffect(() => {
    setHighlightedParcelles(initialParcelles);
    setIsParcelleSelectionEnabled(true);

    return () => {
      setIsParcelleSelectionEnabled(false);
    };
  }, [
    initialParcelles,
    setHighlightedParcelles,
    setIsParcelleSelectionEnabled,
  ]);

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
            const isInvalid = invalidParcelles.includes(parcelle);
            return (
              <Badge
                key={parcelle}
                isInteractive
                color={isHovered ? "red" : isInvalid ? "purple" : "green"}
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

      {invalidParcelles.length > 0 && (
        <Alert
          background={defaultTheme.colors.purpleTint}
          borderColor={defaultTheme.colors.purple600}
          marginTop={8}
          hasIcon={false}
          padding={8}
        >
          <Text color={defaultTheme.colors.purple600}>
            {invalidParcelles.length > 1
              ? "Plusieurs parcelles n'existent pas dans le cadastre"
              : "Une parcelle n'existe pas dans le cadastre"}
          </Text>
        </Alert>
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
