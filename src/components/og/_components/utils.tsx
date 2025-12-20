// Text utility constants
export const TITLE_FONT_THRESHOLD = 100
export const TITLE_TRUNCATION_LENGTH = 150
export const DESCRIPTION_TRUNCATION_LENGTH = 200

// Text utility functions
export function getTitleFontSizePx(title: string): number {
  return title.length > TITLE_FONT_THRESHOLD ? 40 : 54
}

export function truncateTitle(title: string): string {
  return title.length > TITLE_TRUNCATION_LENGTH
    ? title.slice(0, TITLE_TRUNCATION_LENGTH) + '...'
    : title
}

export function truncateDescription(description: string): string {
  return description.length > DESCRIPTION_TRUNCATION_LENGTH
    ? description.slice(0, DESCRIPTION_TRUNCATION_LENGTH) + '...'
    : description
}

export function getDescriptionFontSizePx(titleSizePx: number): number {
  return titleSizePx / 1.618
}