import { Alert, Heading, Pane, Paragraph } from "evergreen-ui";
import React from "react";
import { positionsTypesList } from "@/lib/positions-types-list";

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
  const { numero, suffixe, nomVoie, positions, parcelles } =
    signalement.changesRequested;

  console.log("existingLocation", existingLocation);

  const {
    numero: existingNumero,
    suffixe: existingSuffixe,
    nomVoie: existingNomVoie,
    positions: existingPositions,
    parcelles: existingParcelles,
  } = existingLocation;

  return (
    <Pane padding={16}>
      {existingLocation && (
        <Paragraph
          background="white"
          padding={8}
          borderRadius={8}
          marginBottom={8}
          width="100%"
        >
          <h3>Adresse existante</h3>
          <h4>Adresse : </h4>
          <div>
            {existingNumero} {existingSuffixe} {nomVoie}
          </div>
          <h4>Positions : </h4>
          {existingPositions.map(({ point, type }, index) => {
            return (
              <React.Fragment key={index}>
                <span>{getPositionTypeLabel(type)}</span> :{" "}
                {point.coordinates[0]}, {point.coordinates[1]}
                <br />
              </React.Fragment>
            ); // eslint-disable-line react/no-array-index-key
          })}
          <h4>Parcelles : </h4>
          <div className="parcelles-wrapper">
            {existingParcelles.map((parcelle) => (
              <div key={parcelle}>{parcelle}</div>
            ))}
          </div>
        </Paragraph>
      )}
      <Paragraph
        background="white"
        padding={8}
        borderRadius={8}
        marginBottom={8}
        width="100%"
      >
        <h3>Modifications demandées</h3>
        <h4>Adresse : </h4>
        <div>
          {numero} {suffixe} {nomVoie}
        </div>
        <h4>Positions : </h4>
        {positions.map(({ point, type }, index) => {
          return (
            <React.Fragment key={index}>
              <span>{getPositionTypeLabel(type)}</span> : {point.coordinates[0]}
              , {point.coordinates[1]}
              <br />
            </React.Fragment>
          ); // eslint-disable-line react/no-array-index-key
        })}
        <h4>Parcelles : </h4>
        <div className="parcelles-wrapper">
          {parcelles.map((parcelle) => (
            <div key={parcelle}>{parcelle}</div>
          ))}
        </div>
      </Paragraph>

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
