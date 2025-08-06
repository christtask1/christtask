/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Exclude Supabase Edge Functions from the build
  webpack: (config) => {
    // Exclude supabase directory from webpack
    config.module.rules.push({
      test: /supabase\/functions/,
      use: 'ignore-loader'
    })
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },
}

module.exports = nextConfig 