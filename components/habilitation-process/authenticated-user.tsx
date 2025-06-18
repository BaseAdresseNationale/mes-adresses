import NextImage from "next/legacy/image";
import { Pane, Text, Strong } from "evergreen-ui";

interface AuthenticatedUserProps {
  type: "elu" | "mairie";
  title: string;
  flagURL: string | null;
}

function AuthenticatedUser({ type, title, flagURL }: AuthenticatedUserProps) {
  return (
    <Pane display="flex" flexDirection="column" alignItems="center" gap={8}>
      <Pane display="flex" justifyContent="center" alignItems="center">
        <NextImage
          width={66}
          height={66}
          src={flagURL || `/static/images/${type}.svg`}
          alt={`logo ${type}`}
        />
      </Pane>
      <Text
        is="div"
        fontSize="18px"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        marginTop={16}
      >
        Vous êtes identifié comme :&nbsp;
        <Strong fontSize="18px"> {title}</Strong>
      </Text>
    </Pane>
  );
}

export default AuthenticatedUser;
