// OG cards are often shown ~400px wide (Discord, LINE, Slack), so the title is
// sized to stay readable as a thumbnail and the description is kept to two lines.
export const TITLE_TRUNCATION_LENGTH = 110
export const DESCRIPTION_TRUNCATION_LENGTH = 140

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
}

export function truncateTitle(title: string): string {
  return truncate(title, TITLE_TRUNCATION_LENGTH)
}

export function truncateDescription(description: string): string {
  return truncate(description, DESCRIPTION_TRUNCATION_LENGTH)
}

export function getTitleFontSizePx(title: string): number {
  if (title.length <= 28) return 92
  if (title.length <= 56) return 76
  if (title.length <= 84) return 64
  return 54
}
