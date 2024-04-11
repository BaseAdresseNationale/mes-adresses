import React, { useContext } from "react";
import NextLink from "next/link";
import { Pane, Text, HomeIcon, Link } from "evergreen-ui";
import { CommuneType } from "@/types/commune";
import { BaseLocale, Toponyme, Voie } from "@/lib/openapi";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import SignalementContext from "@/contexts/signalement";
import { getSignalementLabel } from "@/lib/utils/signalement";

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
  const { signalements } = useContext(SignalementContext);

  const balEditorPath = router.pathname.split("[balId]")[1];
  const innerPathSplitted = balEditorPath?.split("/");
  const innerPath = innerPathSplitted[1];
  const innerPathLabel =
    voie?.nom ||
    toponyme?.nom ||
    (innerPath === "[token]" ? "" : capitalize(innerPath));

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
      <Text>{baseLocale.nom || "Base Adresse Locale"}</Text>
      <Text color="muted">{" > "}</Text>

      {!innerPath && <Text>{commune.nom}</Text>}

      {innerPath && (
        <>
          <Link is={NextLink} href={`/bal/${baseLocale._id}`}>
            {commune.nom}
          </Link>

          <Text color="muted">{" > "}</Text>
          {signalementLabel ? (
            <>
              <Link is={NextLink} href={`/bal/${baseLocale._id}/signalements`}>
                {innerPathLabel}
              </Link>
              <Text color="muted">{" > "}</Text>
              <Text>{signalementLabel}</Text>
            </>
          ) : (
            <Text>{innerPathLabel}</Text>
          )}
        </>
      )}
    </Pane>
  );
}

export default Breadcrumbs;
