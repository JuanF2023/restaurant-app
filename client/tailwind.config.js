/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Animación para desaparecer hacia abajo
        'slide-fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(20px)' },
        },
        // Animación para aparecer con fade
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-fade-out': 'slide-fade-out 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-in',
      },
    },
  },
  plugins: [],
}
