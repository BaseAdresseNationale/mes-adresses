import { Label, TextareaField } from "evergreen-ui";

import FormInput from "@/components/form-input";

interface CommentProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  validationMessage?: string;
  input?: string;
  limit?: number;
  isDisabled?: boolean;
}

function Comment({
  onChange,
  validationMessage = null,
  input = "",
  limit = 5000,
  isDisabled = false,
}: CommentProps) {
  return (
    <FormInput>
      <Label marginBottom={4} display="block">
        Commentaire
      </Label>
      <TextareaField
        placeholder="Cette note est confidentielle et ne sera pas diffusée."
        value={input}
        disabled={isDisabled}
        onChange={input.length < limit ? onChange : () => {}}
        isInvalid={Boolean(validationMessage)}
        validationMessage={validationMessage}
      />
    </FormInput>
  );
}

export default Comment;
