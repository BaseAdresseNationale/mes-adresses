import React from "react";
import { Popover, Button, Pane } from "evergreen-ui";

const ACCENTS = [
  "à",
  "á",
  "â",
  "é",
  "è",
  "ê",
  "ë",
  "ì",
  "í",
  "î",
  "ï",
  "ò",
  "ó",
  "ô",
  "ö",
  "ú",
  "ù",
  "û",
  "ü",
  "ç",
  "ñ",
  "œ",
  "l·l",
  "À",
  "Á",
  "Â",
  "É",
  "È",
  "Ê",
  "Ë",
  "Ì",
  "Í",
  "Î",
  "Ï",
  "Ò",
  "Ó",
  "Ô",
  "Ö",
  "Ú",
  "Ù",
  "Û",
  "Ü",
  "Ç",
  "Ñ",
  "Œ",
  "L·L",
];

interface AccentToolProps {
  input: string;
  handleAccent: (event: any) => void;
  updateCaret: () => void;
  forwadedRef: { current: { selectionStart: number; selectionEnd: number } };
  isDisabled?: boolean;
}

function AccentTool({
  input,
  handleAccent,
  updateCaret,
  forwadedRef,
  isDisabled = false,
}: AccentToolProps) {
  const handleClick = (event) => {
    const { selectionStart, selectionEnd } = forwadedRef.current;
    const valueWithAccent = {
      target: {
        value: `${input.slice(0, selectionStart)}${event.target.value as string}${input.slice(selectionEnd)}`,
      },
    };

    handleAccent(valueWithAccent);
    updateCaret();
  };

  return (
    <Popover
      content={({ close }) => (
        <Pane width={300} height={300} onClick={close}>
          <Pane
            display="grid"
            gridTemplateColumns="repeat(auto-fit, 44px)"
            gridGap={6}
          >
            {ACCENTS.map((accent) => (
              <Button
                fontSize="large"
                key={accent}
                appearance="minimal"
                value={accent}
                onClick={handleClick}
              >
                {accent}
              </Button>
            ))}
          </Pane>
        </Pane>
      )}
    >
      <Button type="button" disabled={isDisabled}>
        É
      </Button>
    </Popover>
  );
}

export default AccentTool;
