import { Alert, Heading, Pane } from "evergreen-ui";
import React from "react";
import { positionsTypesList } from "@/lib/positions-types-list";

interface SignalementViewerProps {
  signalement: any;
}

const getPositionTypeLabel = (positionType: string) => {
  return positionsTypesList.find((p) => p.value === positionType)?.name;
};

function SignalementViewer({ signalement }: SignalementViewerProps) {
  const { numero, suffixe, nomVoie, positions, parcelles } =
    signalement.changesRequested;

  return (
    <Alert
      margin={16}
      padding={16}
      hasIcon={false}
      intent="warning"
      overflow="scroll"
      title={
        <span style={{ fontWeight: "bold", paddingBottom: "10px" }}>
          Modifications demandées
        </span>
      }
    >
      <legend>Adresse : </legend>
      <div>
        {numero} {suffixe} {nomVoie}
      </div>
      <legend>Positions : </legend>
      {positions.map(({ position, positionType }, index) => {
        return (
          <React.Fragment key={index}>
            <span>{getPositionTypeLabel(positionType)}</span> :{" "}
            {position.coordinates[0]}, {position.coordinates[1]}
            <br />
          </React.Fragment>
        ); // eslint-disable-line react/no-array-index-key
      })}
      <legend>Parcelles : </legend>
      <div className="parcelles-wrapper">
        {parcelles.map((parcelle) => (
          <div key={parcelle}>{parcelle}</div>
        ))}
      </div>

      <style jsx>{`
        legend {
          font-weight: bold;
          margin-top: 8px;
        }
        .parcelles-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      `}</style>
    </Alert>
  );
}

export default SignalementViewer;
