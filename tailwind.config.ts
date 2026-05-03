import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#f5f7fa',
        navy: '#000080',
        saffron: '#FF9933',
        'india-green': '#138808',
        'india-red': '#D32F2F',
        border: '#e0e4ec',
        muted: '#6b7280',
        dim: '#9ca3af',
        'text-dark': '#1a1a2e',
        'text-soft': '#374151',
        'navy-light': '#e8eaf6',
        'navy-mid': '#c5cae9',
        'saffron-light': '#fff3e0',
        'green-light': '#e8f5e9',
        'red-light': '#ffebee',
        white: '#ffffff',
      },
      fontSize: {
        'gt-xs':  ['9px',  { lineHeight: '1.4' }],
        'gt-sm':  ['10px', { lineHeight: '1.4' }],
        'gt-base':['12px', { lineHeight: '1.5' }],
        'gt-md':  ['13px', { lineHeight: '1.5' }],
        'gt-lg':  ['14px', { lineHeight: '1.5' }],
        'gt-xl':  ['15px', { lineHeight: '1.4' }],
        'gt-2xl': ['18px', { lineHeight: '1.3' }],
        'gt-3xl': ['20px', { lineHeight: '1.3' }],
        'gt-4xl': ['22px', { lineHeight: '1.2' }],
      },
      spacing: {
        'gt-xs': '4px',
        'gt-sm': '8px',
        'gt-md': '12px',
        'gt-lg': '16px',
        'gt-xl': '20px',
        'gt-2xl': '24px',
        'gt-3xl': '32px',
      },
      borderRadius: {
        'gt-sm': '3px',
        'gt-md': '4px',
        'gt-lg': '6px',
        'gt-xl': '8px',
        'gt-full': '99px',
      },
      maxWidth: {
        content: '1100px',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
