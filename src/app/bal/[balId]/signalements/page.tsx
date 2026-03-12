import SignalementsPage from "@/components/signalement/signalements-page";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import { Report, ReportsService } from "@/lib/openapi-signalement";

export default async function SignalementsPageSSR({
  params,
}: {
  params: Promise<{
    balId: string;
  }>;
}) {
  const { balId } = await params;

  const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);

  const paginatedReports = await ReportsService.getReports(
    100,
    undefined,
    undefined,
    [Report.status.PENDING],
    undefined,
    [baseLocale.commune]
  );

  return <SignalementsPage paginatedReports={paginatedReports} />;
}
