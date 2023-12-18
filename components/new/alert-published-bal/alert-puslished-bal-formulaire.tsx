import { Revision } from "@/types/revision.type";
import { Link, Pane, Paragraph, Strong } from "evergreen-ui";

const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

interface AlertPublishedBALFormulaireProps {
  revision: Revision;
}

function AlertPublishedBALFormulaire({
  revision,
}: AlertPublishedBALFormulaireProps) {
  return (
    <Pane>
      <Link
        onClick={(e) => e.stopPropagation()}
        href={`${ADRESSE_URL}/commune/${revision.codeCommune}#historical-bal`}
        fontStyle="italic"
      >
        Historique des BALs
      </Link>
    </Pane>
  );
}

export default AlertPublishedBALFormulaire;
