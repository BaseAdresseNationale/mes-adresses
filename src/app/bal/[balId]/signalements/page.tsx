import SignalementsPage from "@/components/signalement/signalements-page";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import { Signalement, SignalementsService } from "@/lib/openapi-signalement";

export default async function SignalementsPageSSR({
  params,
}: {
  params: Promise<{
    balId: string;
  }>;
}) {
  const { balId } = await params;

  const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);

  const paginatedSignalements = await SignalementsService.getSignalements(
    100,
    undefined,
    [Signalement.status.PENDING],
    undefined,
    undefined,
    [baseLocale.commune]
  );

  return <SignalementsPage paginatedSignalements={paginatedSignalements} />;
}
