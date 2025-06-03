import {
  Pane,
  TextInputField,
  ClipboardIcon,
  SmallTickIcon,
  IconButton,
} from "evergreen-ui";
import { useRef, useState } from "react";

interface ShareClipBoardProps {
  title: string;
  url: string;
}

function ShareClipBoard({ title, url }: ShareClipBoardProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const textAreaRef = useRef(null);

  function copyToClipboard() {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  }

  return (
    <Pane display="flex" alignItems="end">
      <TextInputField
        ref={textAreaRef}
        label={title}
        flex={1}
        marginBottom={0}
        value={url}
      />

      {copySuccess ? (
        <IconButton
          marginLeft={4}
          icon={SmallTickIcon}
          intent="success"
          title="Copié"
        />
      ) : (
        <IconButton
          marginLeft={4}
          icon={ClipboardIcon}
          onClick={copyToClipboard}
          title="Copier l'url"
        />
      )}
    </Pane>
  );
}

export default ShareClipBoard;
