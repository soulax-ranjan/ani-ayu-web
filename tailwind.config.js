// import { Config } from "tailwindcss" // Not needed in JS

const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#3a7d6e",        // brand teal
        "primary-hover": "#2d6358", // teal darker hover
        accent: "#3a7d6e",
        ink: "#1E1E1E",
        "muted-text": "#6B6B6B",
        cream: "#FFF9EE",
        "card-bg": "#FFFFFF",
        "border-color": "#E5E5E5",
        placeholder: "#F4F4F4",
        mint: "#FFF9EE",
        secondary: "#3a7d6e",
        tertiary: "#3a7d6e",
        "sky-blue": "#3a7d6e",
        "coral-pink": "#3a7d6e",
        "mint-green": "#3a7d6e",
        "purple-pop": "#3a7d6e"
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
