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
        customBlue: "rgb(30, 144, 255)",
        customGreen: "rgb(0, 128, 0)",
      },
    },
  },
  plugins: [],
};
export default config;
