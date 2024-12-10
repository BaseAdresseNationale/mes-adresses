import React, { useContext } from "react";
import NextLink from "next/link";
import { Pane, Text, HomeIcon, Link, PaneProps } from "evergreen-ui";
import { CommuneType } from "@/types/commune";
import { BaseLocale, Toponyme, Voie } from "@/lib/openapi-api-bal";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import LayoutContext from "@/contexts/layout";

type BreadcrumbsProps = {
  baseLocale: BaseLocale;
  commune: CommuneType;
  voie?: Voie;
  toponyme?: Toponyme;
  [x: string]: any;
} & PaneProps;

function Breadcrumbs({
  baseLocale,
  commune,
  voie,
  toponyme,
  ...props
}: BreadcrumbsProps) {
  const router = useRouter();
  const { breadcrumbs } = useContext(LayoutContext);

  const balEditorPath = router.pathname.split("[balId]")[1];
  const innerPathSplitted = balEditorPath?.split("/");
  const innerPath = innerPathSplitted[1];
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

      {!innerPath && <Text>{baseLocale.nom || commune.nom}</Text>}

      {breadcrumbs ? (
        breadcrumbs
      ) : innerPath ? (
        <>
          <Link is={NextLink} href={`/bal/${baseLocale.id}`}>
            {baseLocale.nom || commune.nom}
          </Link>

          <Text color="muted">{" > "}</Text>
          <Text>{innerPathLabel}</Text>
        </>
      ) : null}
    </Pane>
  );
}

export default Breadcrumbs;
