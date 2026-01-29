import React, { useContext } from "react";
import NextLink from "next/link";
import { Pane, Text, Link, PaneProps } from "evergreen-ui";
import { BaseLocale, Toponyme, Voie } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";

type BreadcrumbsProps = {
  baseLocale: BaseLocale;
  voie?: Voie;
  toponyme?: Toponyme;
  [x: string]: any;
} & PaneProps;

function Breadcrumbs({
  baseLocale,
  voie,
  toponyme,
  ...props
}: BreadcrumbsProps) {
  const { breadcrumbs } = useContext(LayoutContext);

  return (
    <Pane
      paddingY={2}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      {...props}
    >
      <Link is={NextLink} href="/">
        Accueil
      </Link>
      <Text color="muted">{" > "}</Text>

      {breadcrumbs ? (
        <>
          <Link is={NextLink} href={`/bal/${baseLocale.id}`}>
            {baseLocale.communeNom}
          </Link>

          <Text color="muted">{" > "}</Text>

          {breadcrumbs}
        </>
      ) : (
        <Text aria-current="page">{baseLocale.communeNom}</Text>
      )}
    </Pane>
  );
}

export default Breadcrumbs;
