import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1f6f3e',
          dark: '#154d2b',
          light: '#e7f3ec',
        },
      },
    },
  },
  plugins: [],
}
export default config
