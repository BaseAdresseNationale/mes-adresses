import React from "react";
import Link from "next/link";
import {
  Pane,
  Heading,
  Button,
  Icon,
  ArrowLeftIcon,
  ErrorIcon,
  Alert,
  Text,
} from "evergreen-ui";

import Main from "@/layouts/main";

import Custom404 from "@/pages/404";

import * as Sentry from "@sentry/nextjs";

interface CustomErrorProps {
  statusCode: number;
}

function CustomError({ statusCode }: CustomErrorProps) {
  if (statusCode === 404) {
    return <Custom404 />;
  }

  return (
    <Main>
      <Pane
        display="flex"
        flex={1}
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        height="50%"
      >
        <Icon
          icon={ErrorIcon}
          size={100}
          marginX="auto"
          marginY={16}
          color="#101840"
        />
        <Heading size={800} marginBottom="2em">
          Erreur {statusCode} - Une erreur est survenue
        </Heading>
        <Alert
          intent="danger"
          title="Merci de contacter notre support"
          marginBottom={16}
        >
          <Text>
            {`Indisponibilité temporaire, merci d'actualiser la page ou de réessayer ultérieurement.`}
          </Text>
        </Alert>
        <Link legacyBehavior href="/" passHref>
          <Button iconBefore={ArrowLeftIcon} is="a">
            Retour à la page d’accueil
          </Button>
        </Link>
      </Pane>
    </Main>
  );
}

export async function getServerSideProps({ res, err }) {
  await Sentry.captureUnderscoreErrorException({ res, err });
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { props: { statusCode } };
}

export default CustomError;
