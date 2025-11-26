import {
  Pane,
  TextInputField,
  TextareaField,
  CrossIcon,
  IconButton,
} from "evergreen-ui";

export interface StyleMap {
  name: string;
  url: string;
}

interface StyleMapFieldProps {
  initialValue: StyleMap;
  onChange: (key: string, value: string) => void;
  onDelete: () => void;
  errors?: Record<"url" | "name", boolean>;
}

function StyleMapField({
  initialValue,
  onChange,
  onDelete,
  errors,
}: StyleMapFieldProps) {
  return (
    <Pane
      position="relative"
      display="flex"
      flexDirection="column"
      border="1px solid #e0e0e0"
      borderRadius={8}
      padding={10}
      marginBottom={10}
      marginTop={10}
      backgroundColor="white"
    >
      <IconButton
        title="Supprimer le fond de carte"
        onClick={() => onDelete()}
        intent="danger"
        icon={CrossIcon}
        position="absolute"
        top={0}
        right={0}
        appearance="minimal"
      />
      <TextInputField
        label="Nom"
        title="Nom du fond de carte"
        value={initialValue.name}
        onChange={(e) => onChange("name", e.target.value)}
        width="80%"
        marginBottom={0}
        placeholder="Plan IGN"
        required
        validationMessage={
          errors?.["name"] == false &&
          (initialValue.name === ""
            ? "Le nom est obligatoire"
            : "Le nom est invalide")
        }
        isInvalid={errors?.["name"] == false}
      />
      <TextareaField
        label="Url"
        required
        title="URL du fond de carte"
        value={initialValue.url}
        onChange={(e) => onChange("url", e.target.value)}
        marginBottom={8}
        placeholder="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
        validationMessage={
          errors?.["url"] == false && "L'url du fond de carte est invalide"
        }
        isInvalid={errors?.["url"] == false}
      />
    </Pane>
  );
}

export default StyleMapField;
