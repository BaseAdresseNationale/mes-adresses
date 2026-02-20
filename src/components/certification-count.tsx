import { Text, EndorsedIcon } from "evergreen-ui";

interface CertificationCountProps {
  nbNumeros: number;
  nbNumerosCertifies: number;
}

function CertificationCount({
  nbNumeros,
  nbNumerosCertifies,
}: CertificationCountProps) {
  return (
    <Text fontWeight="bold" whiteSpace="nowrap">
      {nbNumerosCertifies} / {nbNumeros}{" "}
      <EndorsedIcon color="success" style={{ verticalAlign: "sub" }} />
    </Text>
  );
}

export default CertificationCount;
