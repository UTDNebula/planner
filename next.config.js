/* eslint-disable @typescript-eslint/no-var-requires */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = withBundleAnalyzer({
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
});

module.exports = nextConfig;
