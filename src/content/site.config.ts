export const SITE = {
  displayName: 'ALTR',
  siteTitle: "ALTR's Digital Garden",
  github: 'https://github.com/chuan-khuna',
}

export const THEMES = [
  {
    preset: 'nzk',
    name: 'Light',
    default: true,
    syntaxTheme: 'catppuccin-latte',
    icon: 'Sun',
  },
  {
    preset: 'dark',
    name: 'Dark',
    default: false,
    syntaxTheme: 'catppuccin-macchiato',
    icon: 'Moon',
  },
  {
    preset: 'nexus',
    name: 'Nexus',
    default: false,
    syntaxTheme: 'catppuccin-macchiato',
    icon: 'Flame',
  },
] as const
