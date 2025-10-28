import { Pane, StarIcon, StarEmptyIcon } from "evergreen-ui";

interface StarRatingProps {
  value: number;
}

function StarRating({ value }: StarRatingProps) {
  const stars = [];

  // Créer 5 étoiles
  for (let i = 1; i <= 5; i++) {
    if (i <= value) {
      // Étoile pleine pour la valeur
      stars.push(<StarIcon key={i} size={48} color="warning" />);
    } else {
      // Étoile vide pour le reste
      stars.push(<StarEmptyIcon key={i} size={48} color="muted" />);
    }
  }

  return (
    <Pane
      marginTop={16}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap={16}
    >
      {stars}
    </Pane>
  );
}

export default StarRating;
