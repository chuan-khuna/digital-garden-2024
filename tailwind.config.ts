import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        // quote: '#ff7048',
        // cactus colours
        'cactus-bg': 'oklch(var(--theme-bg) / <alpha-value>)',
        'cactus-text': 'oklch(var(--theme-text) / <alpha-value>)',
        'cactus-link': 'oklch(var(--theme-link) / <alpha-value>)',
        'cactus-accent': 'oklch(var(--theme-accent) / <alpha-value>)',
        'cactus-accent-2': 'oklch(var(--theme-accent-2) / <alpha-value>)',
        'cactus-quote': 'oklch(var(--theme-quote) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Lato',
          'Metric',
          'MetricHPEXS',
          ...defaultTheme.fontFamily.sans,
        ],
        serif: [
          'DM Serif Text',
          'DM Serif Display',
          'Canela',
          ...defaultTheme.fontFamily.serif,
        ],
        mono: ['Inconsolata', ...defaultTheme.fontFamily.mono],
        metric: ['Metric', 'MetricHPEXS', 'MetricHPEXS Medium'],
        canela: ['Canela Deck', 'Canela'],
        montez: ['Montez', 'cursive'],
        resumesans: ['Metric', 'MetricHPEXS', 'MetricHPEXS_Medium'],
        resumeserif: [
          'Canela Deck',
          'Canela',
          'DM Serif Text',
          'DM Serif Display',
        ],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            a: {
              textUnderlineOffset: '2px',
              '&:hover': {
                '@media (hover: hover)': {
                  textDecorationColor: 'var(--color-link)',
                  textDecorationThickness: '2px',
                },
              },
            },
            blockquote: {
              borderLeftWidth: '0',
            },
            code: {
              border: '1px dotted #666',
              borderRadius: '2px',
            },
            kbd: {
              "&:where([data-theme='dark'], [data-theme='dark'] *)": {
                background: 'var(--color-global-text)',
              },
            },
            hr: {
              borderTopStyle: 'dashed',
            },
            strong: {
              fontWeight: '700',
            },
            sup: {
              marginInlineStart: 'calc(var(--spacing) * 0.5)',
              a: {
                '&:after': {
                  content: "']'",
                },
                '&:before': {
                  content: "'['",
                },
                '&:hover': {
                  '@media (hover: hover)': {
                    color: 'var(--color-link)',
                  },
                },
              },
            },
            /* Table */
            'tbody tr': {
              borderBottomWidth: 'none',
            },
            tfoot: {
              borderTop: '1px dashed #666',
            },
            thead: {
              borderBottomWidth: 'none',
            },
            'thead th': {
              borderBottom: '1px dashed #666',
              fontWeight: '700',
            },
            'th[align="center"], td[align="center"]': {
              'text-align': 'center',
            },
            'th[align="right"], td[align="right"]': {
              'text-align': 'right',
            },
            'th[align="left"], td[align="left"]': {
              'text-align': 'left',
            },
          },
        },
        sm: {
          css: {
            code: {
              fontSize: 'var(--text-sm)',
              fontWeight: '400',
            },
          },
        },
      }),
    },
  },
} satisfies Config
