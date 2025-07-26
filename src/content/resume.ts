export const RESUME = {
  header: {
    name: 'Phattharanat Khunakornophat',
    jobTitle: 'Data Scientist/Developer',
    email: 'k.phattharanat@gmail.com',
    github: 'https://github.com/chuan-khuna',
    githubName: 'chuan-khuna',
    introduction:
      'I three years of experience as a Data Scientist and Developer. Most of my tasks are about providing analyses to support a strategy team. I gained experience in the field of spatiotemporal data and time series analysis whilst working on my senior project.',
    location: 'Bangkok, Thailand',
  },
  skills: {
    languages: ['Python', 'Haskell', 'Elixir', 'R', 'SQL', 'Ruby', 'Go'],
    frameworks: [
      'Django',
      'FastAPI',
      'pandas',
      'numpy',
      'pythainlp',
      'gensim',
      'NLTK',
      'streamlit',
      'matplotlib',
      'seaborn',
      'Phoenix',
      'Fiber',
      'Gin',
    ],
    tools: [
      'Git',
      'Docker',
      'uv',
      'Postgres',
      'MongoDB',
      'Airflow',
      'Kafka',
      'Bitbucket Pipelines',
      'Ollama',
      'RAG',
      'MCP',
      'Google Looker Studio',
      'Chroma Vector Database',
      'Digital Ocean',
      'AWS'
    ],
    dataScienceDetails: [
      'Data visualisation with matplotlib, seaborn, Google Looker Studio, streamlit',
      'Text network analysis, word cloud',
      'Time series analysis, RFM analysis, cohort analysis, association rule learning',
    ],
    machineLearningDetails: [
      'Achieved TensorFlow Developer Certificate',
      'Trained Speech Emotion Recognition model using LSTM and Transformer',
      'Built a simple RAG/MCP for Jira task summarisation',
    ],
  },
  experiences: [
    {
      jobTitle: 'Data Scientist',
      company: 'The Mather',
      time: 'Jul 2022 - Present',
      details: [
        'Provide data analysis and visualisation for the strategy team',
        'Implement data scraper for social media platforms including Pantip (Thailand discussion forum), Twitter, YouTube and TikTok',
        'Analyse point of sale data including RFM analysis, cohort analysis and association rule learning',
        'Train a Thai Speech Emotion Recognition model using Transformer architecture, achieving 60% validation accuracy across five classes data',
        'Analyse and visualise survey responses using word cloud, n-gram and LDA topic modelling',
        'Research, design and develop backend systems and data pipelines for a proof-of-concept project centred in real-time people detection, face recognition using Django, FastAPI, DBSCAN, Airflow, Chroma',
        'Research and implement Retrieval-Augmented Generation and Model Context Protocol for Postgres and Jira',
        'Implement basic Bitbucket Pipelines to automate the deployment to an internal testing server, eliminating manual tasks',
        'Maintain and refactor Django starter template, adding TOTP and LINE login features, websocket-based notifications, migrating package manager from pip to uv',
        'Explore, containerise, scaffold project structure for backend frameworks including Go Fiber, Elixir Phoenix',
        'Develop a proof-of-concept vehicle detection system using TimescaleDB, Kafka, YOLO, RF-DETR, and Svelte',
        'Configure and manage cloud instances, including setting up environments, installing dependencies, and managing Nginx and Cloudflare for web infrastructure',
        'Research and set up an internal shadcn component registry to enable reusable UI components across projects',
      ],
    },
  ],
  projects: [
    {
      title: 'altr - my personal python package',
      time: 'May 2025',
      description: 'Personal project',
      url: 'https://github.com/chuan-khuna/altr',
      details: [
        'A collection of snippets of code for solving problems bundled as python package that can be installed from github',
      ],
    },
    {
      title: 'Wordle game by Haskell',
      time: 'Sep 2023',
      description: 'Personal project',
      url: 'https://github.com/chuan-khuna/learning-haskell',
      details: [
        'Implement the Wordle puzzle in Haskell language to explore functional programming style',
      ],
    },
    {
      title: 'Wordle But Statistics',
      time: 'Jan 2022',
      description: 'Personal project',
      url: 'https://github.com/chuan-khuna/wordle-but-statistics',
      details: [
        'Solve the Wordle puzzle optimally by using statistics/information theory',
      ],
    },
    {
      title:
        'Bias Correction of Multi-Dimensional Climate Data and Visualisation',
      time: '2019 - 2020',
      description: 'Senior project at KMUTNB',
      url: null,
      details: [
        'Developed a backend server for climate analysis tasks: trend analysis (Mann-Kendall test), spatiotemporal data visualisation',
        'Performed and evaluated performance of climate bias correction methods',
      ],
    },
    {
      title: 'Data Mining and AI Course',
      time: '2019 - 2020',
      description: 'Enrolled University Courses at KMUTNB',
      url: null,
      details: [
        'Implemented basic machine learning models: linear regression, linear classification, K-mean, Naïve Bayes, bias-variance trade-off',
        'Explored and visualised NILM (Non-Intrusive Load Monitoring) dataset',
      ],
    },
  ],
}
