import { useState, useEffect, useCallback, useContext } from "react";
import { Link, Pane, Paragraph, Strong } from "evergreen-ui";
import { DataGouvService } from "@/lib/data-gouv/data-gouv";
import { Dataset } from "@/lib/data-gouv/types";
import { Revision } from "@/types/revision.type";

const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

interface AlertPublishedBALMoissoneurProps {
  revision: Revision;
}

function AlertPublishedBALMoissoneur({
  revision,
}: AlertPublishedBALMoissoneurProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadDataset = async () => {
      if (revision.context.extras.sourceId) {
        const sourceId: string = revision.context.extras.sourceId;
        const id: string[] = sourceId.split("-");
        const dataset: Dataset = await DataGouvService.findDataset(id[1]);

        setUrl(`${dataset.organization.page}#/datasets`);
      }
    };

    loadDataset();
  }, [revision]);

  return (
    <Pane>
      <Link onClick={(e) => e.stopPropagation()} href={url} fontStyle="italic">
        Lien organisation data.gouv
      </Link>
    </Pane>
  );
}

export default AlertPublishedBALMoissoneur;
