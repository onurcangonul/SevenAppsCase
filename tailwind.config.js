/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#09090B',
        surface: '#131316',
        elevated: '#1B1B20',
        hairline: '#27272D',
        chalk: '#FAFAFA',
        muted: '#A1A1AA',
        faint: '#6B6B75',
        accent: '#F04642',
        danger: '#F04642',
        playhead: '#FFD23F',
        ink: '#09090B',
      },
      borderRadius: {
        card: '14px',
        control: '12px',
      },
      spacing: {
        gutter: '20px',
      },
    },
  },
  plugins: [],
};
