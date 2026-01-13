import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";

import { Pane } from "evergreen-ui";

import "maplibre-gl/dist/maplibre-gl.css";

import { LocalStorageContextProvider } from "@/contexts/local-storage";
import { HelpContextProvider } from "@/contexts/help";
import { TokenContextProvider } from "@/contexts/token";

import Header from "@/components/header";
import IEWarning from "@/components/ie-warning";
import Help from "@/components/help";
import Editor from "@/layouts/editor";
import { BALRecoveryProvider } from "@/contexts/bal-recovery";
import { BalDataContextProvider } from "@/contexts/bal-data";
import { OpenAPI } from "@/lib/openapi-api-bal";
import { OpenAPI as OpenAPISignalement } from "@/lib/openapi-signalement";
import { SignalementContextProvider } from "@/contexts/signalement";
import { LayoutContextProvider } from "@/contexts/layout";
import { BALWidgetProvider } from "@/contexts/bal-widget";
import { SearchPaginationContextProvider } from "@/contexts/search-pagination";
import { MatomoTrackingContextProvider } from "@/contexts/matomo-tracking";
import { AlertsContextProvider } from "@/contexts/alerts";
import Main from "@/layouts/main";

const openAPIBase = process.env.NEXT_PUBLIC_BAL_API_URL.split("/")
  .slice(0, -1)
  .join("/");
Object.assign(OpenAPI, { BASE: openAPIBase });

Object.assign(OpenAPISignalement, {
  BASE: process.env.NEXT_PUBLIC_API_SIGNALEMENT,
});

function App(props: AppProps) {
  const {
    Component,
    pageProps,
    router: { query },
  } = props;

  return (
    <MatomoTrackingContextProvider pageProps={pageProps}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>mes-adresses.data.gouv.fr</title>
        <meta
          name="description"
          content="Mes Adresses est un outil en ligne qui vous permet de gérer simplement vos adresses, de la constitution d’une Base Adresse Locale à sa mise à jour. Il est accessible sans compétences techniques et dispose d’un tutoriel embarqué."
        />
      </Head>

      <LayoutContextProvider balId={query.balId as string}>
        <BALWidgetProvider>
          <LocalStorageContextProvider>
            <TokenContextProvider
              balId={query.balId as string}
              _token={query.token as string}
            >
              <HelpContextProvider>
                <BALRecoveryProvider balId={query.balId as string}>
                  <Help />
                  <Pane
                    height="100%"
                    width="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    <Header />
                    <>
                      <IEWarning />
                      {query.balId && pageProps ? (
                        <Main isEditor>
                          <AlertsContextProvider>
                            <BalDataContextProvider
                              initialBaseLocale={pageProps.baseLocale}
                              initialVoie={pageProps.voie}
                              initialToponyme={pageProps.toponyme}
                              initialNumeros={pageProps.numeros}
                            >
                              <SearchPaginationContextProvider>
                                <SignalementContextProvider>
                                  <Editor {...pageProps}>
                                    <Component {...pageProps} />
                                  </Editor>
                                </SignalementContextProvider>
                              </SearchPaginationContextProvider>
                            </BalDataContextProvider>
                          </AlertsContextProvider>
                        </Main>
                      ) : (
                        <Component {...pageProps} />
                      )}
                    </>
                  </Pane>
                </BALRecoveryProvider>
              </HelpContextProvider>
            </TokenContextProvider>
          </LocalStorageContextProvider>
        </BALWidgetProvider>
      </LayoutContextProvider>

      <style jsx global>{`
        div[id^="evergreen-tooltip"].ub-max-w_240px.ub-bg-clr_white.ub-box-szg_border-box {
          max-width: fit-content;
        }

        .main-table-cell:hover {
          background-color: #e4e7eb;
        }

        .glass-pane {
          /* From https://css.glass */
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        // Evergreen UI Tabs customization for accessibility
        div[role="tablist"] > span[aria-selected="true"] {
          color: #0038e0;
        }

        @keyframes delay-bar {
          0% {
            width: 100%;
          }
          100% {
            width: 0;
          }
        }
      `}</style>
    </MatomoTrackingContextProvider>
  );
}

export default App;
