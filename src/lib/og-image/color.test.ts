import { describe, expect, it } from 'vitest'
import { oklch } from '@/lib/og-image/color'

describe('oklch', () => {
  it('maps the achromatic extremes to black and white', () => {
    expect(oklch(0, 0, 0)).toBe('rgba(0, 0, 0, 1)')
    expect(oklch(1, 0, 0)).toBe('rgba(255, 255, 255, 1)')
  })

  it('converts a chromatic colour', () => {
    // oklch(0.628 0.2577 29.23) is sRGB red
    expect(oklch(0.628, 0.2577, 29.23)).toBe('rgba(255, 0, 0, 1)')
  })

  it('clamps out-of-gamut channels and keeps alpha', () => {
    expect(oklch(0.9, 0.4, 140, 0.5)).toMatch(
      /^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), 0\.5\)$/,
    )
  })
})
