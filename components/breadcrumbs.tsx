import React, { useMemo } from "react";
import NextLink from "next/link";
import { Pane, Text, HomeIcon, Link } from "evergreen-ui";
import { CommuneType } from "@/types/commune";
import { BaseLocale, Toponyme, Voie } from "@/lib/openapi";
import { useRouter } from "next/router";
import { capitalize } from "lodash";

interface BreadcrumbsProps {
  baseLocale: BaseLocale;
  commune: CommuneType;
  voie?: Voie;
  toponyme?: Toponyme;
}

function Breadcrumbs({
  baseLocale,
  commune,
  voie,
  toponyme,
  ...props
}: BreadcrumbsProps) {
  const router = useRouter();
  const innerPath = router.pathname.split("[balId]")[1]?.split("/")[1];
  const innerPathLabel =
    voie?.nom ||
    toponyme?.nom ||
    (innerPath === "[token]" ? "" : capitalize(innerPath));

  return (
    <Pane
      paddingY={2}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      {...props}
    >
      <NextLink href="/">
        <HomeIcon style={{ verticalAlign: "middle", color: "#000" }} />
      </NextLink>
      <Text color="muted">{" > "}</Text>
      <Text>{baseLocale.nom || "Base Adresse Locale"}</Text>
      <Text color="muted">{" > "}</Text>

      {!innerPath && <Text>{commune.nom}</Text>}

      {innerPath && (
        <>
          <Link is={NextLink} href={`/bal/${baseLocale._id}`}>
            {commune.nom}
          </Link>

          <Text color="muted">{" > "}</Text>
          <Text>{innerPathLabel}</Text>
        </>
      )}
    </Pane>
  );
}

export default Breadcrumbs;
