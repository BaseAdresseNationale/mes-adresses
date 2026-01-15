import BALHomePage from "../page";
import TokenGuard from "@/layouts/token-guard";

export default async function TokenPageSSR({
  params,
}: {
  params: Promise<{
    token: string;
    balId: string;
  }>;
}) {
  const { token, balId } = await params;

  return (
    <TokenGuard token={token} balId={balId}>
      <BALHomePage />
    </TokenGuard>
  );
}
