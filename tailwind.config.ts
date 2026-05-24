import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-lato)',
          'Metric',
          'MetricHPEXS',
          ...defaultTheme.fontFamily.sans,
        ],
        serif: [
          'var(--font-dm-serif-text)',
          'var(--font-dm-serif-display)',
          'Canela',
          ...defaultTheme.fontFamily.serif,
        ],
        mono: ['var(--font-inconsolata)', ...defaultTheme.fontFamily.mono],
        metric: [
          'Metric',
          'MetricHPEXS',
          'MetricHPEXS Medium',
          'MetricHPEXS Bold',
        ],
        canela: ['Canela Deck', 'Canela'],
        montez: ['var(--font-montez)', 'cursive'],
        resumesans: [
          'Metric',
          'MetricHPEXS',
          'MetricHPEXS_Medium',
          'MetricHPEXS_Bold',
        ],
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
