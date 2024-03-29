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
import useMatomoTracker from "@/hooks/matomo-tracker";
import Editor from "@/layouts/editor";
import { BALRecoveryProvider } from "@/contexts/bal-recovery";
import { BalDataContextProvider } from "@/contexts/bal-data";
import { OpenAPI } from "@/lib/openapi";
import { OpenAPI as OpenAPISignalement } from "@/lib/openapi-signalement";
import { SignalementContextProvider } from "@/contexts/signalement";

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

  useMatomoTracker(
    {
      trackingEnabled: process.env.NODE_ENV === "production",
      siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
      trackerUrl: process.env.NEXT_PUBLIC_MATOMO_TRACKER_URL,
    },
    pageProps
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>mes-adresses.data.gouv.fr</title>
      </Head>

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
                    <BalDataContextProvider
                      initialBaseLocale={pageProps.baseLocale}
                      initialVoie={pageProps.voie}
                      initialToponyme={pageProps.toponyme}
                      initialVoies={pageProps.voies}
                      initialToponymes={pageProps.toponymes}
                      initialNumeros={pageProps.numeros}
                    >
                      <SignalementContextProvider>
                        <Editor {...pageProps}>
                          <Component {...pageProps} />
                        </Editor>
                      </SignalementContextProvider>
                    </BalDataContextProvider>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </>
              </Pane>
            </BALRecoveryProvider>
          </HelpContextProvider>
        </TokenContextProvider>
      </LocalStorageContextProvider>
      {/* ⚠️ This is needed to expand Evergreen’Tootip width
      It select all Tooltip components with 'appearance: card' propertie */}
      <style jsx global>{`
        div[id^="evergreen-tooltip"].ub-max-w_240px.ub-bg-clr_white.ub-box-szg_border-box {
          max-width: fit-content;
        }
      `}</style>
    </>
  );
}

export default App;
