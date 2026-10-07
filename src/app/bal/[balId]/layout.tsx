import { AlertsContextProvider } from "@/contexts/alerts";
import { BalDataContextProvider } from "@/contexts/bal-data";
import { CadastreContextProvider } from "@/contexts/cadastre";
import { EventsContextProvider } from "@/contexts/events";
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
      <CadastreContextProvider codeCommune={baseLocale.commune}>
        <AlertsContextProvider>
          <BalDataContextProvider initialBaseLocale={baseLocale}>
            <EventsContextProvider>
              <SearchPaginationContextProvider>
                <SignalementContextProvider>
                  <Editor>{children}</Editor>
                </SignalementContextProvider>
              </SearchPaginationContextProvider>
            </EventsContextProvider>
          </BalDataContextProvider>
        </AlertsContextProvider>
      </CadastreContextProvider>
    </TokenContextProvider>
  );
}
