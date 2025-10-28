const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  images: {
    domains: ["base-adresse-locale-prod-blasons-communes.s3.fr-par.scw.cloud"],
  },
  webpack(config, { webpack }) {
    config.resolve.fallback = { fs: false };

    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr/)
    );

    return config;
  },
  async redirects() {
    return [
      {
        source: "/dashboard(.*)",
        destination: `${ADRESSE_URL}/deploiement-bal`,
        permanent: true,
      },
    ];
  },
});

// Injected content via Sentry wizard below

if (process.env.SENTRY_ENABLED === "true") {
  const { withSentryConfig } = require("@sentry/nextjs");

  module.exports = withSentryConfig(module.exports, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "sentry",
    project: "mes-adresses",
    sentryUrl: "https://sentry.anct.cloud-ed.fr/",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  });
}
