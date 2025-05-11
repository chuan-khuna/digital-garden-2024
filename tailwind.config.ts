import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from "tailwindcss/plugin";

const svgToDataUri = require("mini-svg-data-uri");

const {
  default: flattenColorPalette
} = require("tailwindcss/lib/util/flattenColorPalette");

const {
  default: toColorValue
} = require("tailwindcss/lib/util/toColorValue");


const config = {
  darkMode: ['selector'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // quote: '#ff7048',
        // cactus colours
        'cactus-bg': "hsl(var(--theme-bg) / <alpha-value>)",
        'cactus-text': "hsl(var(--theme-text) / <alpha-value>)",
        'cactus-link': "hsl(var(--theme-link) / <alpha-value>)",
        'cactus-accent': "hsl(var(--theme-accent) / <alpha-value>)",
        "cactus-accent-2": "hsl(var(--theme-accent-2) / <alpha-value>)",
        'cactus-quote': "hsl(var(--theme-quote) / <alpha-value>)",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Lato', ...fontFamily.sans],
        serif: ['DM Serif Text', 'DM Serif Display', ...fontFamily.serif],
        mono: ['Inconsolata', ...fontFamily.mono],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
      animation: {
        'meteor-effect': 'meteor 5s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: (theme) => ({
        cactus: {
          css: {
            "--tw-prose-body": theme("colors.cactus-text / 1"),
            "--tw-prose-headings": theme("colors.cactus-accent-2 / 1"),
            "--tw-prose-links": theme("colors.cactus-text / 1"),
            "--tw-prose-bold": theme("colors.cactus-text / 1"),
            "--tw-prose-bullets": theme("colors.cactus-text / 1"),
            "--tw-prose-quotes": theme("colors.cactus-quote / 1"),
            "--tw-prose-code": theme("colors.cactus-text / 1"),
            "--tw-prose-hr": "0.5px dashed #666",
            "--tw-prose-th-borders": "#666",
          },
        },
        DEFAULT: {
          css: {
            a: {
              "@apply cactus-a-link no-underline": "",
            },
            strong: {
              fontWeight: "700",
            },
            code: {
              border: "1px dotted #666",
              borderRadius: "2px",
            },
            blockquote: {
              borderLeftWidth: "0",
            },
            hr: {
              borderTopStyle: "dashed",
            },
            thead: {
              borderBottomWidth: "none",
            },
            "thead th": {
              fontWeight: "700",
              borderBottom: "1px dashed #666",
            },
            "tbody tr": {
              borderBottomWidth: "none",
            },
            tfoot: {
              borderTop: "1px dashed #666",
            },
            sup: {
              "@apply ms-0.5": "",
              a: {
                "@apply bg-none": "",
                "&:hover": {
                  "@apply text-cactus-link no-underline bg-none": "",
                },
                "&:before": {
                  content: "'['",
                },
                "&:after": {
                  content: "']'",
                },
              },
            },
          },
        },
        sm: {
          css: {
            code: {
              fontSize: theme("fontSize.sm")[0],
              fontWeight: "400",
            },
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography'), addVariablesForColors, bgDotGrid, plugin(cactusThemeFunc)],
} satisfies Config

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}


function cactusThemeFunc({ addComponents }) {
  addComponents({
    ".cactus-a-link": {
      "@apply bg-[size:100%_6px] bg-bottom bg-repeat-x": {},
      backgroundImage:
        "linear-gradient(transparent,transparent 5px,hsl(var(--theme-text)) 5px,hsl(var(--theme-text)))",
      "&:hover": {
        backgroundImage:
          "linear-gradient(transparent,transparent 4px,hsl(var(--theme-link)) 4px,hsl(var(--theme-link)))",
      },
    },
    ".title": {
      "@apply text-2xl font-semibold text-cactus-accent-2": {},
    },
  });
}

function bgDotGrid({ matchUtilities, theme }: any) {
  matchUtilities(
    {
      "bg-grid": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-grid-small": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-dot": (value: any) => {
        // console.log("🍵 ~ bgDotGrid ~ value:", value)

        // console.log(theme("cactus-text"))

        let colours = flattenColorPalette(theme("colors"))
        // console.log("🍵 ~ bgDotGrid ~ colours:", colours)

        let colourValue = toColorValue(value)
        // console.log("🍵 ~ bgDotGrid ~ colourValue:", colourValue)

        return ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
          )}")`,
        })
      },
      "bg-dot-large": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.25"></circle></svg>`
        )}")`,
      }),
    },
    { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
  );
}

export default config


