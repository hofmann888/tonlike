import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|avatar|button|card|checkbox|chip|divider|dropdown|form|input|link|modal|progress|select|slider|tabs|toast|toggle|user|pagination|ripple|spinner|menu|popover|listbox|scroll-shadow|skeleton).js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [heroui(
    {
      themes: {
        dark: {
          colors: {
            background: "#000012",
            // foreground: "#ededed",
          },
        },
      },
    }
  )],
} satisfies Config;
