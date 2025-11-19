import {
  Pane,
  SelectField,
  TextInputField,
  TextareaField,
  CrossIcon,
  IconButton,
  Alert,
} from "evergreen-ui";
import InputLabel from "@/components/input-label";

export interface StyleMap {
  id: string;
  name: string;
  type: "vector" | "raster";
  url: string;
}

interface StyleMapFieldProps {
  initialValue: StyleMap;
  onChange: (key: string, value: string) => void;
  onDelete: () => void;
}

function StyleMapField({
  initialValue,
  onChange,
  onDelete,
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
      <Pane
        display="flex"
        justifyContent="space-between"
        gap={10}
        alignItems="end"
        marginBottom={8}
      >
        <TextInputField
          label="Nom"
          title="Nom du fond de carte"
          value={initialValue.name}
          onChange={(e) => onChange("name", e.target.value)}
          width="80%"
          marginBottom={0}
          placeholder="Plan IGN"
          required
        />
        <SelectField
          label="Type"
          onChange={(e) => onChange("type", e.target.value)}
          width="20%"
          marginBottom={0}
        >
          <option value="raster" selected>
            Raster
          </option>
          <option value="vector">Vector</option>
        </SelectField>
      </Pane>
      <TextareaField
        label="Url"
        required
        title="URL du fond de carte"
        value={initialValue.url}
        onChange={(e) => onChange("url", e.target.value)}
        marginBottom={8}
        placeholder="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
      />
    </Pane>
  );
}

export default StyleMapField;
