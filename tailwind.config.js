// import { Config } from "tailwindcss" // Not needed in JS

const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#167A6B",     // teal
        accent: "#F4AE3A",     // marigold
        ink: "#3D2F27",     // deep text
        cream: "#FAF7F1",     // soft bg
        mint: "#E9F4F1",
        placeholder: "#F4F4F4"
      },
      borderRadius: {
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "28px",
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,.06)",
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
export default config
