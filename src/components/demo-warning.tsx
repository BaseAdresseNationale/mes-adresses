"use client";

import { useState, useCallback, useContext } from "react";
import {
  Pane,
  Text,
  Button,
  Dialog,
  TextInputField,
  WarningSignIcon,
} from "evergreen-ui";

import { BasesLocalesService } from "@/lib/openapi-api-bal";

import BalDataContext from "@/contexts/bal-data";

import { useInput } from "@/hooks/input";
import useFocus from "@/hooks/focus";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";

interface DemoWarningProps {
  isReadonly: boolean;
}

function DemoWarning({ isReadonly }: DemoWarningProps) {
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
        Cette Base Adresse Locale de démonstration sera supprimée d’ici 24
        heures sans modifications
      </Text>
    </Pane>
  );
}

export default DemoWarning;
