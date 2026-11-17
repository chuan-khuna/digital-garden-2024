# Resume source

This is the rewritten Default Version (`src/content/resume/index/`) from 2026-11-17. It was written with the `writing-tools:resume` skill, and every claim comes from the current resume, the owner's answers, the `bazaar-tracker-gpui` README, or the senior project report. Use it as the source when you update the resume content files.

## Header

- **Name:** Phattharanat Khunakornophat
- **Job title:** Data Scientist and Developer
- **Email:** k.phattharanat@gmail.com
- **GitHub:** [chuan-khuna](https://github.com/chuan-khuna)
- **Location:** Bangkok, Thailand

### Introduction

I am a data scientist and developer with four years' experience in data analysis, computer vision, and backend development. I train machine learning models and deploy them to production. I also build the backend services and cloud infrastructure that run them.

## Experience

### Data Scientist, The Mather

Jul 2022 - Present · visible on web, resume print, and CV print

- **Computer vision systems**: Design and develop end-to-end pipelines for vehicle and accident detection, face-recognition visitor management, event people counting, and product-on-shelf detection, with Kafka, RabbitMQ, and TimescaleDB.
- **Object detection**: Train and fine-tune custom models with YOLO and RF-DETR.
- **Sales data analysis**: Analyse point-of-sale (POS) data for clients with Recency, Frequency, Monetary (RFM) analysis, cohort analysis, and association rule learning, and visualise the results.
- **Survey text analysis**: Analyse survey responses with word clouds, n-grams, and Latent Dirichlet Allocation (LDA) topic modelling.
- **Backend development**: Build and maintain a standardised Django starter template with Docker and PostgreSQL.
- **DevOps**: Automate deployments with Bitbucket Pipelines and standardise deployment commands in a Justfile.
- **Infrastructure**: Configure Cloudflare Tunnel to route multiple domains, and manage Nginx on AWS and DigitalOcean.

## Skills

- **Languages:** Python, Rust, Haskell, Elixir, R, SQL, Ruby, and JavaScript
- **Frameworks and libraries:** Django, FastAPI, pandas, NumPy, PyThaiNLP, Gensim, NLTK, Streamlit, Matplotlib, seaborn, YOLO, RF-DETR, Phoenix, and Astro
- **Tools:** Git, Docker, uv, just, PostgreSQL, TimescaleDB, MongoDB, Airflow, Kafka, RabbitMQ, Nginx, Cloudflare, Bitbucket Pipelines, Ollama, RAG, MCP, Google Looker Studio, DigitalOcean, AWS, and Obsidian

## Projects

The projects are listed in their `order` value.

### 1. The Bazaar Tracker

Mar 2026 - Present · Personal project · <https://github.com/chuan-khuna/bazaar-tracker-gpui> · web only

- Build a Windows desktop tracker for The Bazaar in Rust and GPUI that records each run from the game's log file and memory.

### 2. altr: personal Python package

May 2025 · Personal project · <https://github.com/chuan-khuna/altr> · web, resume print, and CV print

- Bundled reusable code snippets into a Python package that installs from GitHub.

### 3. Wordle in Haskell

Sep 2023 · Personal project · <https://github.com/chuan-khuna/learning-haskell> · web only

- Implemented Wordle in Haskell to learn the functional programming style.

### 4. Astro Digital Garden

2025 - Present · Personal project · <https://github.com/chuan-khuna/digital-garden-2024> · web, resume print, and CV print

- Build a personal website with Astro, React, and Tailwind CSS on Cloudflare Workers, with a resume that prints to PDF.

### 5. Wordle

Oct 2026 - Present · Personal project · <https://github.com/chuan-khuna/wordle> · web, resume print, and CV print

- Port the solver's precompute from Python to Rust, which cuts an estimated 9 to 35 hours to about 26 minutes with byte-identical output.
- Simulate full games for every opener against all 2,315 answers. The best opener, TARSE, averages 3.43 guesses and never loses.
- Rank guesses by expected information or by expected candidates, under eight strategies.
- Build a native desktop app in Rust and GPUI, with a Solver panel that explains each suggested guess.
- Write 11 articles in English and Thai on a Next.js and FastAPI website, with interactive widgets that explain the solver.

### 6. POS Rewrite in Rust

Oct 2026 · Personal project · no public repo · web only (to confirm)

- Rewrote a family business's point-of-sale (POS) app from Rails to a native Windows app in Rust, gpui-kit, and SQLite.
- Fixed stock tracking, which the old app had lost for most products, by restoring stock when an order is deleted and blocking deletion of records with orders.
- Built an import that cleans duplicates, mixed orders, mistyped dates, and float noise in prices from the old database, and reports each fix.
- Replaced force-pushes of the database to git with snapshot backups and a restore command.

### 7. Bias Correction of Multi-Dimensional Climate Data and Visualisation

2019 - 2020 · Senior project at KMUTNB · web only

- Developed the backend of a web application that maps downscaled climate data for Thailand, with Mann-Kendall trend tests and time-series charts.
- Compared additive, multiplicative, and linear regression bias correction on regional climate model (RCM) temperature and rainfall data against Thai Meteorological Department observations.
- Found that linear regression corrected temperature best, while no method reduced the error in rainfall.

### 8. Data Mining and AI Course

2019 - 2020 · Coursework at KMUTNB · web only

- Implemented linear regression, linear classification, k-means, and Naïve Bayes models, and studied the bias-variance trade-off.
- Explored and visualised a Non-Intrusive Load Monitoring (NILM) dataset.

## Education

### Bachelor of Engineering, Computer Engineering

King Mongkut's University of Technology North Bangkok · Aug 2016 - Apr 2020 · web, resume print, and CV print

- First Class Honours (CGPA 3.83)
- Senior Project: Bias Correction of Multi-Dimensional Climate Data and Visualisation

## Activities

### Internal meetup talk: "What Not to Plot and Data Visualisation in History"

Aug 2023 · The Mather

- Reviewed a chart and proposed improvements to its design.
- Presented well-designed data visualisations from history.

## Interests

- Data visualisation
- Table tennis
- Music by Sawano Hiroyuki
- Functional programming in Haskell and Elixir
- Personal knowledge management with Zettelkasten and evergreen notes

## Now

Last updated: 2024-04-14 (see open question 1)

Welcome to my resume! This section tells you what I am doing now.

I am interested in functional programming, especially monads. I enjoy Earl Grey tea and speciality coffee.

I am also suffering from gastritis, conjunctivitis, dry eye, and De Quervain's tenosynovitis.

I have tried many note-taking apps, including Roam Research, Craft, Logseq, Obsidian, Tana, and Heptabase. I am practising the Zettelkasten and evergreen notes methods, but I still find them hard.

## Open questions

1. The Now section is public on the web resume, and it was last updated on 2024-04-14. Keep the health conditions? Is the rest still true?
