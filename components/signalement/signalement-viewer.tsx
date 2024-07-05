import { Pane, Paragraph } from "evergreen-ui";
import React from "react";
import { positionsTypesList } from "@/lib/positions-types-list";
import {
  NumeroChangesRequestedDTO,
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { Numero, Toponyme, Voie } from "@/lib/openapi";

interface SignalementViewerProps {
  signalement: Signalement;
  existingLocation?: Voie | Toponyme | Numero;
}

const getPositionTypeLabel = (positionType: string) => {
  return positionsTypesList.find((p) => p.value === positionType)?.name;
};

const getExistingLocationLabel = (existingLocation) => {
  if (existingLocation.numeroComplet) {
    return `${existingLocation.numeroComplet} ${existingLocation.voie.nom}`;
  }

  return existingLocation.nom;
};

function SignalementViewer({
  signalement,
  existingLocation,
}: SignalementViewerProps) {
  const { numero, suffixe, nomVoie, positions, parcelles, nom } =
    signalement.changesRequested as NumeroChangesRequestedDTO &
      ToponymeChangesRequestedDTO;

  return (
    <Pane padding={16}>
      {signalement.type !== Signalement.type.LOCATION_TO_CREATE && (
        <Paragraph
          is="div"
          background="white"
          padding={8}
          borderRadius={8}
          marginBottom={8}
          width="100%"
        >
          <h3>Lieu concerné</h3>
          <div>{getExistingLocationLabel(existingLocation)}</div>
          {(existingLocation as Numero | Toponyme).positions?.length > 0 && (
            <>
              <h5>Positions : </h5>
              {(existingLocation as Numero | Toponyme).positions.map(
                ({ point, type }, index) => {
                  return (
                    <React.Fragment key={index}>
                      <span>{getPositionTypeLabel(type)}</span> :{" "}
                      {point.coordinates[0]}, {point.coordinates[1]}
                      <br />
                    </React.Fragment>
                  ); // eslint-disable-line react/no-array-index-key
                }
              )}
            </>
          )}
          {(existingLocation as Numero | Toponyme).parcelles?.length > 0 && (
            <>
              <h5>Parcelles : </h5>
              <div className="parcelles-wrapper">
                {(existingLocation as Numero | Toponyme).parcelles.map(
                  (parcelle) => (
                    <div key={parcelle}>{parcelle}</div>
                  )
                )}
              </div>
            </>
          )}
        </Paragraph>
      )}
      {(signalement.type === Signalement.type.LOCATION_TO_UPDATE ||
        signalement.type === Signalement.type.LOCATION_TO_CREATE) && (
        <Paragraph
          is="div"
          background="white"
          padding={8}
          borderRadius={8}
          marginBottom={8}
          width="100%"
        >
          {signalement.type === Signalement.type.LOCATION_TO_UPDATE && (
            <h3>Modifications demandées</h3>
          )}
          {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
            <h3>Création demandée</h3>
          )}
          <div>
            {numero} {suffixe} {nomVoie} {nom}
          </div>
          {positions?.length > 0 && (
            <>
              <h5>Positions : </h5>
              {positions.map(({ point, type }, index) => {
                return (
                  <React.Fragment key={index}>
                    <span>{getPositionTypeLabel(type)}</span> :{" "}
                    {point.coordinates[0]}, {point.coordinates[1]}
                    <br />
                  </React.Fragment>
                ); // eslint-disable-line react/no-array-index-key
              })}
            </>
          )}
          {parcelles?.length > 0 && (
            <>
              <h5>Parcelles : </h5>
              <div className="parcelles-wrapper">
                {parcelles.map((parcelle) => (
                  <div key={parcelle}>{parcelle}</div>
                ))}
              </div>
            </>
          )}
        </Paragraph>
      )}

      {signalement.changesRequested.comment && (
        <Paragraph
          background="white"
          padding={8}
          borderRadius={8}
          marginBottom={8}
          width="100%"
        >
          <h3>Commentaire</h3>
          <div>{signalement.changesRequested.comment}</div>
        </Paragraph>
      )}

      {signalement.source && (
        <Paragraph
          background="white"
          padding={8}
          borderRadius={8}
          marginBottom={8}
          width="100%"
        >
          <h3>Source du signalement</h3>
          <div>{signalement.source.nom}</div>
        </Paragraph>
      )}

      <style jsx>{`
        h3,
        h4,
        h5 {
          margin: 4px 0;
        }
        .parcelles-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      `}</style>
    </Pane>
  );
}

export default SignalementViewer;
