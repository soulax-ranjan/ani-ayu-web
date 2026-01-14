// import { Config } from "tailwindcss" // Not needed in JS

const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#F6B400",     // brand gold
        "primary-hover": "#D99600",     // gold hover/darker
        accent: "#3A7D44",     // leaf green
        ink: "#1E1E1E",     // primary text (dark)
        "muted-text": "#6B6B6B",     // muted text
        cream: "#FFF9EE",     // warm cream background
        "card-bg": "#FFFFFF",     // white card background
        "border-color": "#E5E5E5",     // light borders
        placeholder: "#F4F4F4",
        // Legacy aliases for existing components
        mint: "#FFF9EE",
        secondary: "#3A7D44",
        tertiary: "#F6B400",
        // Category colors using the new palette
        "sky-blue": "#F6B400",     // boys category (use gold)
        "coral-pink": "#3A7D44",     // sale/offer (use green)
        "mint-green": "#3A7D44",     // accent (leaf green)
        "purple-pop": "#F6B400"     // girls category (use gold)
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
