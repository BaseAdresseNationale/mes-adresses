import { FileRejection, useDropzone } from "react-dropzone";
import { Pane, Spinner, Paragraph, PaneProps } from "evergreen-ui";

interface UploaderProps {
  file: File | null;
  maxSize: number;
  placeholder: string;
  onDrop: ([file]: [any]) => Promise<void>;
  onDropRejected: (rejectedFiles: FileRejection[]) => void;
  height?: number;
  isLoading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
}

function Uploader({
  file,
  maxSize,
  placeholder,
  onDrop,
  onDropRejected,
  height = 100,
  isLoading,
  loadingLabel = "Chargement…",
  ...props
}: UploaderProps & Omit<PaneProps, "onDrop">) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize,
    onDrop,
    onDropRejected,
    multiple: false,
  });

  if (isLoading) {
    return (
      <Pane
        border
        height={150}
        background="tint1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size={32} />
        <Paragraph marginTop={8}>Analyse en cours</Paragraph>
      </Pane>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active" : ""}`}
    >
      <Pane
        border
        height={height}
        background="tint1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        cursor="pointer"
        wordWrap="break-word"
        elevation={isDragActive ? 0 : null}
        {...props}
      >
        <input {...getInputProps()} />
        <Paragraph color={file ? "default" : "muted"}>
          {file ? file.name : placeholder}
        </Paragraph>
      </Pane>
    </div>
  );
}

export default Uploader;
