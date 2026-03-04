import { AlertsContextProvider } from "@/contexts/alerts";
import { BalDataContextProvider } from "@/contexts/bal-data";
import { SearchPaginationContextProvider } from "@/contexts/search-pagination";
import { SignalementContextProvider } from "@/contexts/signalement";
import { TokenContextProvider } from "@/contexts/token";
import Editor from "@/layouts/editor";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import { notFound } from "next/navigation";

export default async function EditorLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    balId: string;
  }>;
}>) {
  const { balId } = await params;

  let baseLocale;
  try {
    baseLocale = await BasesLocalesService.findBaseLocale(balId, true);
  } catch {
    notFound();
  }

  return (
    <TokenContextProvider balId={balId}>
      <AlertsContextProvider>
        <BalDataContextProvider initialBaseLocale={baseLocale}>
          <SearchPaginationContextProvider>
            <SignalementContextProvider>
              <Editor>{children}</Editor>
            </SignalementContextProvider>
          </SearchPaginationContextProvider>
        </BalDataContextProvider>
      </AlertsContextProvider>
    </TokenContextProvider>
  );
}
