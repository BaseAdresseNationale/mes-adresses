"use client";
import NextLink from "next/link";
import { useContext } from "react";
import { Pane, Text, Button, WarningSignIcon } from "evergreen-ui";

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
      <Text fontSize={isMobile ? 10 : 14}>
        Vous ne pouvez pas la modifier cette BAL car une autre a été publié pour{" "}
        {communeName} :
      </Text>

      <Button
        height={24}
        marginX=".5em"
        is={NextLink}
        href={`/bal/${otherBalIdPublished}`}
      >
        Voir la BAL publiée
      </Button>
    </Pane>
  );
}

export default AlreadyBalPublishedWarning;
