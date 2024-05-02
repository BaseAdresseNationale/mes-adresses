import { Tooltip, Text, EndorsedIcon } from "evergreen-ui";

interface CertificationCountProps {
  nbNumeros: number;
  nbNumerosCertifies: number;
}

function CertificationCount({
  nbNumeros,
  nbNumerosCertifies,
}: CertificationCountProps) {
  return (
    <Tooltip content="Adresses certifiées par la commune">
      <Text fontWeight="bold" whiteSpace="nowrap">
        {nbNumerosCertifies} / {nbNumeros}{" "}
        <EndorsedIcon color="success" style={{ verticalAlign: "sub" }} />
      </Text>
    </Tooltip>
  );
}

export default CertificationCount;
