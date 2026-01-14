import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import _withBundleAnalyzer from "@next/bundle-analyzer";

const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

const withBundleAnalyzer = _withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = withBundleAnalyzer({
  reactCompiler: true,
  redirects: async () => {
    return [
      {
        source: "/dashboard(.*)",
        destination: `${ADRESSE_URL}/deploiement-bal`,
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      new URL(
        "https://base-adresse-locale-prod-blasons-communes.s3.fr-par.scw.cloud/**"
      ),
      new URL("https://api.panoramax.xyz/**"),
    ],
  },
});

export default withSentryConfig(nextConfig, {
  org: "sentry",
  project: "mes-adresses",
  sentryUrl: "https://sentry.anct.cloud-ed.fr/",
  // Upload source maps for readable stack traces
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Route Sentry requests through your server (avoids ad-blockers)
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
