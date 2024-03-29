const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'

const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true,      // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  webpack(config, {webpack}) {
    config.resolve.fallback = {fs: false}

    config.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr/))

    return config
  },
  async redirects() {
    return [
      {
        source: '/dashboard(.*)',
        destination: `${ADRESSE_URL}/deploiement-bal`,
        permanent: true,
      },
    ]
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const withPWA = require('next-pwa')({
  dest: "public",
  disable: process.env.NODE_ENV === "development", 
  register: true, // Register the PWA service worker
  skipWaiting: true, 
})

module.exports = withPWA(withBundleAnalyzer(nextConfig))
