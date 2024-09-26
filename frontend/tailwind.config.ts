import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customRed: "rgb(250,50,10)", // Example of RGB
        customDarkRed: "rgb(150,30,6)",
        primary: "#1a2634", // Dark background color
        secondary: "#24323f", // Slightly lighter for sections
        third: "#384d61",
        accent: "#4FD1C5", // Button color or accents
        buttonHover: "#38B2AC", // Hover state for buttons
        borderColor: "#718096", // Neutral border color
        textPrimary: "#EDF2F7", // Light text color
        textSecondary: "#A0AEC0", // Subtle text color
        warning: "#E53E3E", // Error or warning text
      },
    },
  },
  plugins: [],
};
export default config;
