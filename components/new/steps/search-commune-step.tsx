import { CommuneSearchField } from "@/components/commune-search";
import { CommuneType } from "@/types/commune";
import { Pane } from "evergreen-ui";
import { useEffect, useState } from "react";
import CommunePublicationInfos from "../commune-publication-infos";

interface SearchCommuneStepProps {
  commune: CommuneType | null;
  setCommune: (commune: CommuneType | null) => void;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
}

function SearchCommuneStep({
  commune,
  setCommune,
  outdatedApiDepotClients,
  outdatedHarvestSources,
}: SearchCommuneStepProps) {
  const [ref, setRef] = useState<HTMLInputElement>();

  useEffect(() => {
    if (ref) {
      ref.focus();
    }
  }, [ref]);

  return (
    <Pane>
      <CommuneSearchField
        required
        innerRef={setRef}
        id="commune"
        initialSelectedItem={commune}
        label="Rechercher une commune"
        hint="Pour affiner la recherche, renseignez le code département"
        placeholder="Roche 42"
        appearance="default"
        maxWidth={500}
        onSelect={setCommune}
      />
      {commune && (
        <CommunePublicationInfos
          commune={commune}
          outdatedApiDepotClients={outdatedApiDepotClients}
          outdatedHarvestSources={outdatedHarvestSources}
        />
      )}
    </Pane>
  );
}

export default SearchCommuneStep;
