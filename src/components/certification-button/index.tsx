import { useMemo } from "react";
import { Button, EndorsedIcon } from "evergreen-ui";
import styles from "./certification-button.module.css";

export interface CertificationButtonProps {
  isLoading: boolean;
  isCertified: boolean;
  onConfirm?: (certified: boolean | null) => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

function CertificationButton({
  isLoading,
  onConfirm,
  onCancel,
  isCertified,
  children,
}: CertificationButtonProps) {
  const submitCertificationLabel = useMemo(() => {
    if (isLoading) {
      return "En cours…";
    }

    return isCertified ? "Enregistrer" : "Certifier et enregistrer";
  }, [isLoading, isCertified]);

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return "En cours…";
    }

    return isCertified ? "Ne plus certifier et enregistrer" : "Enregistrer";
  }, [isLoading, isCertified]);

  return (
    <div className={styles["certification-button-wrapper"]}>
      {onConfirm && (
        <div>
          <Button
            isLoading={isLoading}
            type="submit"
            appearance="primary"
            intent="success"
            iconAfter={EndorsedIcon}
            onClick={() => onConfirm(isCertified ? null : true)}
          >
            {submitCertificationLabel}
          </Button>
        </div>
      )}

      {onConfirm && (
        <div>
          <Button
            isLoading={isLoading}
            type="submit"
            appearance="default"
            intent={isCertified ? "danger" : "success"}
            onClick={() => onConfirm(isCertified ? false : null)}
          >
            {submitLabel}
          </Button>
        </div>
      )}

      {children && <div>{children}</div>}

      <div>
        <Button
          disabled={isLoading}
          type="button"
          appearance="default"
          display="inline-flex"
          onClick={onCancel}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}

export default CertificationButton;
