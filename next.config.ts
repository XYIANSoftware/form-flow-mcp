import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Configuration for Netlify deployment
	output: 'export',
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	// Exclude MCP directory from ESLint
	eslint: {
		ignoreDuringBuilds: false,
		dirs: ['src'],
	},
}

export default nextConfig
