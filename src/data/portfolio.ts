// A Projects showcase card: clicking the card opens `url` (or `github` when
// there is no website); the GitHub icon opens the repo.
export type Project = {
  name: string
  description: string
  url?: string
  github?: string
}

export const portfolio = {
  displayName: 'ALTR',
  firstName: 'Phattharanat',
  name: 'Phattharanat Khunakornophat',
  nickname: 'Chuan',
  timezone: 'Asia/Bangkok',
  // image file in `public` folder
  avatarUrl: 'lucy.jpg',
  headLine: 'I take an avid interest in data science and data visualisation.',
  shortIntros: [
    '💻 Data Scientist | Developer',
    '📊 I take an avid interest in data visualisation',
    '🌱 Digital Gardener',
    '🏓 Table Tennis',
    '🎹 Sawano Hiroyuki music enjoyer ',
  ],
  interests: [
    'Data Visualisation',
    'Functional Programming',
    'Monad',
    'Haskell, Elixir',
    'MCP (Model Context Protocol)',
    'RAG (Retrieval Augmented Generation)',
  ],
  skills: [
    'Python',
    'Haskell',
    'Data Visualisation',
    'Docker',
    'Git',
    'PostgreSQL',
    'Django',
  ],
  // shown in the Projects showcase under the bento grid, in this order
  projects: [
    {
      name: 'Nexus',
      url: 'https://nexus.altrf.dev',
      github: 'https://github.com/chuan-khuna/nexus',
      description:
        'A link hub: a profile card and links to everything I build.',
    },
    {
      name: 'Matcha',
      url: 'https://matcha.altrf.dev/',
      github: 'https://github.com/chuan-khuna/altr-matcha-menu',
      description:
        'What if I had a matcha cafe? This is what the digital menu would look like.',
    },
    {
      name: 'Stoa',
      url: 'https://stoa.altrf.dev/',
      github: 'https://github.com/chuan-khuna/astro-stoa',
      description:
        'A curated collection of Stoic quotes for quiet, distraction-free reading.',
    },
    {
      name: 'Dictionary TUI',
      github: 'https://github.com/chuan-khuna/dictionary-tui',
      description:
        'A terminal dictionary app: look up a word in Oxford, Cambridge, Merriam-Webster and Google EN-TH side by side, with your search history.',
    },
  ] as Project[],
}
