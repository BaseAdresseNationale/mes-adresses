import ToponymeNumerosPage from "@/components/toponyme/toponyme-numeros-page";
import BALDataUpdate from "@/layouts/bal-data-update";
import { Numero, ToponymesService } from "@/lib/openapi-api-bal";

export default async function ToponymeNumerosPageSSR({
  params,
}: {
  params: Promise<{
    idToponyme: string;
  }>;
}) {
  const { idToponyme } = await params;
  const toponyme = await ToponymesService.findToponyme(idToponyme);
  const numeros: Numero[] =
    await ToponymesService.findToponymeNumeros(idToponyme);

  return (
    <BALDataUpdate toponyme={toponyme} numeros={numeros}>
      <ToponymeNumerosPage />
    </BALDataUpdate>
  );
}
