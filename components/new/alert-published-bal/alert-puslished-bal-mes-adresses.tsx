import { useState, useEffect, useCallback, useContext } from "react";
import { Revision } from "@/types/revision.type";
import { Link, Pane, Paragraph, Strong } from "evergreen-ui";

const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

interface AlertPublishedBALMesAdressesProps {
  revision: Revision;
}

function AlertPublishedBALMesAdresses({
  revision,
}: AlertPublishedBALMesAdressesProps) {
  const [balId, setBalId] = useState<string | null>(null);

  useEffect(() => {
    const initBalId = async () => {
      if (revision.context.extras.balId) {
        setBalId(revision.context.extras.balId);
      }
    };

    initBalId();
  }, [revision]);

  return (
    <Pane>
      <Link
        onClick={(e) => e.stopPropagation()}
        href={`/bal/${balId}`}
        fontStyle="italic"
      >
        Link consultation
      </Link>
    </Pane>
  );
}

export default AlertPublishedBALMesAdresses;
