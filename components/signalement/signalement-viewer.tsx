import { Pane, Paragraph } from "evergreen-ui";
import React from "react";
import { positionsTypesList } from "@/lib/positions-types-list";
import { Signalement } from "@/lib/openapi-signalement";

interface SignalementViewerProps {
  signalement: any;
  existingLocation?: any;
}

const getPositionTypeLabel = (positionType: string) => {
  return positionsTypesList.find((p) => p.value === positionType)?.name;
};

function SignalementViewer({
  signalement,
  existingLocation,
}: SignalementViewerProps) {
  const { numero, suffixe, nomVoie, positions, parcelles, nom } =
    signalement.changesRequested;

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
          <h3>Lieu existant</h3>
          <div>
            {existingLocation.numero} {existingLocation.suffixe}{" "}
            {existingLocation.nomVoie} {existingLocation.nom}
          </div>
          {existingLocation.positions && (
            <>
              <h4>Positions : </h4>
              {existingLocation.positions.map(({ point, type }, index) => {
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
          {existingLocation.parcelles && (
            <>
              <h4>Parcelles : </h4>
              <div className="parcelles-wrapper">
                {existingLocation.parcelles.map((parcelle) => (
                  <div key={parcelle}>{parcelle}</div>
                ))}
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
          {positions && (
            <>
              <h4>Positions : </h4>
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
          {parcelles && (
            <>
              <h4>Parcelles : </h4>
              <div className="parcelles-wrapper">
                {parcelles.map((parcelle) => (
                  <div key={parcelle}>{parcelle}</div>
                ))}
              </div>
            </>
          )}
        </Paragraph>
      )}

      {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
        <Paragraph
          background="white"
          padding={8}
          borderRadius={8}
          marginBottom={8}
          width="100%"
        >
          <h4>Commentaire : </h4>
          <div>{signalement.comment}</div>
        </Paragraph>
      )}

      <Paragraph
        background="white"
        padding={8}
        borderRadius={8}
        marginBottom={8}
        width="100%"
      >
        <h3>Auteur du signalement</h3>
        <Pane display="flex">
          <Pane marginRight={20}>
            <h4>Nom</h4>
            <div>{signalement.author?.lastName}</div>
          </Pane>
          <Pane marginRight={20}>
            <h4>Prénom</h4>
            <div>{signalement.author?.firstName}</div>
          </Pane>
          <Pane>
            <h4>Email</h4>
            <div>{signalement.author?.email}</div>
          </Pane>
        </Pane>
      </Paragraph>

      <style jsx>{`
        h3,
        h4 {
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
