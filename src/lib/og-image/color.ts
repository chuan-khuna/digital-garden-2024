/**
 * oklch → sRGB for Satori, which cannot read CSS variables and does not parse
 * `oklch()`. OG palettes stay written in oklch (copied from src/styles/presets/)
 * and are converted here at render time.
 */

const toGamma = (x: number) =>
  x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055

const to255 = (x: number) =>
  Math.round(Math.min(1, Math.max(0, toGamma(x))) * 255)

/** `oklch(L C H)` (L in 0–1, H in degrees) → `rgba(r, g, b, alpha)`. */
export function oklch(l: number, c: number, h: number, alpha = 1): string {
  const rad = (h * Math.PI) / 180
  const a = c * Math.cos(rad)
  const b = c * Math.sin(rad)

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3

  const r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
  const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
  const bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_

  return `rgba(${to255(r)}, ${to255(g)}, ${to255(bl)}, ${alpha})`
}
