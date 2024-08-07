import { Pane, Button, ChevronLeftIcon } from "evergreen-ui";

import CodeValidation from "@/components/habilitation-process/validate-authentication/code-validation";

interface ValidateAuthenticationProps {
  emailCommune: string;
  validatePinCode: (code: string) => Promise<void>;
  resendCode: () => Promise<boolean>;
  onCancel: () => void;
}

function ValidateAuthentication({
  emailCommune,
  validatePinCode,
  resendCode,
  onCancel,
}: ValidateAuthenticationProps) {
  return (
    <Pane>
      <CodeValidation
        email={emailCommune}
        resendCode={resendCode}
        handleSubmit={validatePinCode}
      />

      <Button iconBefore={ChevronLeftIcon} onClick={onCancel}>
        Annuler
      </Button>
    </Pane>
  );
}

export default ValidateAuthentication;
