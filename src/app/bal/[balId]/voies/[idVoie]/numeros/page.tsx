import { ExtendedVoieDTO, Numero, VoiesService } from "@/lib/openapi-api-bal";
import { VoieNumerosPage } from "@/components/voie/voie-numeros-page";
import BalDataUpdate from "@/layouts/bal-data-update";

export default async function VoieNumerosPageSSR({
  params,
}: {
  params: Promise<{
    idVoie: string;
  }>;
}) {
  const { idVoie } = await params;
  const voie: ExtendedVoieDTO = await VoiesService.findVoie(idVoie);
  const numeros: Numero[] = await VoiesService.findVoieNumeros(idVoie);

  return (
    <BalDataUpdate voie={voie} numeros={numeros}>
      <VoieNumerosPage />
    </BalDataUpdate>
  );
}
