import { Textarea, Label } from "evergreen-ui";

import FormInput from "@/components/form-input";

interface CommentProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  input?: string;
  limit?: number;
  isDisabled?: boolean;
}

function Comment({
  onChange,
  input = "",
  limit = 5000,
  isDisabled = false,
}: CommentProps) {
  return (
    <FormInput>
      <Label marginBottom={4} display="block">
        Commentaire
      </Label>
      <Textarea
        placeholder="Cette note ne sera pas diffusée, mais ne doit pas contenir d'informations personnelles conformément au RGPD"
        value={input}
        disabled={isDisabled}
        onChange={input.length < limit ? onChange : () => {}}
      />
    </FormInput>
  );
}

export default Comment;
