"use client";
import NextLink from "next/link";
import { useContext } from "react";
import { Pane, Text, Button, WarningSignIcon, Link } from "evergreen-ui";

import LayoutContext from "@/contexts/layout";

interface AlreadyBalPublishedWarningProps {
  otherBalIdPublished: string;
  communeName: string;
  isReadonly: boolean;
}

function AlreadyBalPublishedWarning({
  otherBalIdPublished,
  communeName,
  isReadonly,
}: AlreadyBalPublishedWarningProps) {
  const { isMobile } = useContext(LayoutContext);

  return (
    <Pane
      width="100%"
      textAlign="center"
      backgroundColor="orange"
      position="fixed"
      bottom={isReadonly ? 50 : 0}
      height={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <WarningSignIcon
        size={20}
        marginX=".5em"
        style={{ verticalAlign: "sub" }}
      />
      <Text is="p" fontSize={isMobile ? 10 : 14}>
        Une BAL est déjà publiée pour la commune de {communeName}
      </Text>

      <Button
        height={24}
        marginX=".5em"
        is={NextLink}
        href={`/bal/${otherBalIdPublished}`}
      >
        Accèder à la BAL publiée
      </Button>
      <Text is="p" fontSize={isMobile ? 10 : 14}>
        ou contacter le support:{" "}
        <Link href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</Link>
      </Text>
    </Pane>
  );
}

export default AlreadyBalPublishedWarning;
