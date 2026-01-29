import { VoiesService } from "@/lib/openapi-api-bal";
import VoiePage from "@/components/voie/voie-page";
import BALDataUpdate from "@/layouts/bal-data-update";
import { notFound } from "next/navigation";

export default async function VoiePageSSR({
  params,
}: {
  params: Promise<{
    idVoie: string;
  }>;
}) {
  const { idVoie } = await params;

  let voie;
  try {
    voie = await VoiesService.findVoie(idVoie);
  } catch (e) {
    notFound();
  }

  return (
    <BALDataUpdate voie={voie}>
      <VoiePage />
    </BALDataUpdate>
  );
}
