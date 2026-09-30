import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f4efe4",
        surface: "#fffdf8",
        fg: "#1c3324",
        muted: "#5d6f62",
        primary: { DEFAULT: "#1f6a46", fg: "#f6fbf7" },
        accent: { DEFAULT: "#c45c26", fg: "#fff8f3" },
        border: "#d4ddd4",
        leaf: "#3d8b64",
        ink: "#0f2318"
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"]
      },
      boxShadow: {
        card: "0 1px 2px rgb(28 51 36 / 0.06), 0 8px 24px rgb(28 51 36 / 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
