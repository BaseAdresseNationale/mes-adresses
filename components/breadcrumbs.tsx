import React, { useContext } from "react";
import NextLink from "next/link";
import { Pane, Text, HomeIcon, Link, PaneProps } from "evergreen-ui";
import { CommuneType } from "@/types/commune";
import { BaseLocale, Toponyme, Voie } from "@/lib/openapi-api-bal";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import SignalementContext from "@/contexts/signalement";
import { getSignalementLabel } from "@/lib/utils/signalement";

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
  const { signalements } = useContext(SignalementContext);

  const balEditorPath = router.pathname.split("[balId]")[1];
  const innerPathSplitted = balEditorPath?.split("/");
  let innerPath = innerPathSplitted[1];
  const selectedTab: string = router.query.selectedTab as string;
  if (!innerPath && selectedTab) {
    innerPath = selectedTab;
  }
  let innerPathLabel = innerPath === "[token]" ? "" : capitalize(innerPath);

  let secondInnerPathLabel;
  if (innerPath === "voies" || innerPath === "toponymes") {
    secondInnerPathLabel = voie?.nom || toponyme?.nom;
  }

  let signalementLabel;
  if (innerPath === "signalements" && router.query.idSignalement) {
    const signalementId = router.query.idSignalement;
    const signalement = signalements.find(
      (signalement) => signalement._id === signalementId
    );
    signalementLabel = signalement && getSignalementLabel(signalement);
  }

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

      {innerPath && (
        <>
          <Link is={NextLink} href={`/bal/${baseLocale.id}`}>
            {baseLocale.nom || commune.nom}
          </Link>

          <Text color="muted">{" > "}</Text>
          {signalementLabel ? (
            <>
              <Link is={NextLink} href={`/bal/${baseLocale.id}/signalements`}>
                {innerPathLabel}
              </Link>
              <Text color="muted">{" > "}</Text>
              <Text>{signalementLabel}</Text>
            </>
          ) : (
            <>
              {secondInnerPathLabel ? (
                <>
                  <Link
                    is={NextLink}
                    href={`/bal/${baseLocale.id}?selectedTab=${innerPath}`}
                  >
                    {innerPathLabel}
                  </Link>

                  <Text color="muted">{" > "}</Text>
                  <Text>{secondInnerPathLabel}</Text>
                </>
              ) : (
                <Text>{innerPathLabel}</Text>
              )}
            </>
          )}
        </>
      )}
    </Pane>
  );
}

export default Breadcrumbs;
