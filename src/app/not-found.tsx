"use client";

import Link from "next/link";
import {
  Pane,
  Button,
  Icon,
  RouteIcon,
  Heading,
  ArrowLeftIcon,
} from "evergreen-ui";

export default function NotFound() {
  return (
    <>
      <Pane
        display="flex"
        flex={1}
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        height="50%"
      >
        <Icon
          icon={RouteIcon}
          size={100}
          marginX="auto"
          marginY={16}
          color="#101840"
        />
        <Heading size={800} marginBottom="2em">
          Erreur 404 - Page introuvable
        </Heading>
        <Button iconBefore={ArrowLeftIcon} is={Link} href="/">
          Retour à la page d’accueil
        </Button>
      </Pane>
    </>
  );
}
