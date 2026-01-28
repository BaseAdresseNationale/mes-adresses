import type { Metadata } from "next";
import { extractStyles } from "evergreen-ui";
import { MatomoTrackingContextProvider } from "@/contexts/matomo-tracking";
import { LayoutContextProvider } from "@/contexts/layout";
import { BALWidgetProvider } from "@/contexts/bal-widget";
import { LocalStorageContextProvider } from "@/contexts/local-storage";
import { HelpContextProvider } from "@/contexts/help";
import Help from "@/components/help";
import { initialOpenAPIBaseURL } from "@/lib/open-api";
import Main from "@/layouts/main";
import { BALRecoveryProvider } from "@/contexts/bal-recovery";
import { OpenAPIContextProvider } from "@/contexts/open-api";

import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

export const metadata: Metadata = {
  title: "mes-adresses.data.gouv.fr",
  description:
    "Mes Adresses est un outil en ligne qui vous permet de gérer simplement vos adresses, de la constitution d'une Base Adresse Locale à sa mise à jour.",
};

initialOpenAPIBaseURL();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { css, hydrationScript } = extractStyles();

  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style id="evergreen-css" dangerouslySetInnerHTML={{ __html: css }} />
        {hydrationScript}
      </head>
      <body>
        <OpenAPIContextProvider>
          {/* TODO */}
          <MatomoTrackingContextProvider pageProps={{}}>
            <LayoutContextProvider>
              <BALWidgetProvider>
                <LocalStorageContextProvider>
                  <HelpContextProvider>
                    <BALRecoveryProvider>
                      <Help />
                      <Main>{children}</Main>
                    </BALRecoveryProvider>
                  </HelpContextProvider>
                </LocalStorageContextProvider>
              </BALWidgetProvider>
            </LayoutContextProvider>
          </MatomoTrackingContextProvider>
        </OpenAPIContextProvider>
      </body>
    </html>
  );
}
