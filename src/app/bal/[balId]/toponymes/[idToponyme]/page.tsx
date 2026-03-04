import ToponymePage from "@/components/toponyme/toponyme-page";
import BALDataUpdate from "@/layouts/bal-data-update";
import { ToponymesService } from "@/lib/openapi-api-bal";
import { notFound } from "next/navigation";

export default async function ToponymePageSSR({
  params,
}: {
  params: Promise<{
    idToponyme: string;
  }>;
}) {
  const { idToponyme } = await params;

  let toponyme;
  try {
    toponyme = await ToponymesService.findToponyme(idToponyme);
  } catch {
    notFound();
  }

  return (
    <BALDataUpdate toponyme={toponyme}>
      <ToponymePage />
    </BALDataUpdate>
  );
}
