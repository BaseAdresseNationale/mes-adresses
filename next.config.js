const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
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
})
