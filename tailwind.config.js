/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0EA5E9',
          secondary: '#64748B',
        },
        categories: {
          attention: '#EF4444',
          memory: '#8B5CF6',
          decisions: '#10B981',
          usability: '#F59E0B',
        }
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px'
      }
    },
  },
  plugins: [],
}

