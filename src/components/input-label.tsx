import { Label, Tooltip, HelpIcon } from "evergreen-ui";

interface InputLabelProps {
  title: string;
  help?: string;
  required?: boolean;
}

function InputLabel({ title, help, required }: InputLabelProps) {
  return (
    <Label marginTop={8} marginBottom={4}>
      {title} {required && <span>*</span>}
      {help && (
        <Tooltip content={help}>
          <HelpIcon marginLeft={4} verticalAlign="middle" />
        </Tooltip>
      )}
    </Label>
  );
}

export default InputLabel;
