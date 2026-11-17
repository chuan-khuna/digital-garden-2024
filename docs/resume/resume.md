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
- **LLM and RAG**: Built a tool-calling agent on Tau and a document RAG pipeline on Qdrant for a support chatbot.
- **Agent framework**: Design a multi-client chatbot core on the Tau agent library, released as a versioned Python package, with an extension standard that adds client tools and skills without core changes.
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

### 3. Wordle in Haskell

Sep 2023 · Personal project · <https://github.com/chuan-khuna/learning-haskell> · web only

- Implemented Wordle in Haskell to learn the functional programming style.

### 4. Astro Digital Garden

2025 - Present · Personal project · <https://github.com/chuan-khuna/digital-garden-2024> · web, resume print, and CV print

- Build a personal website with Astro, React, and Tailwind CSS on Cloudflare Workers, with a resume that prints to PDF.

### 5. Wordle

Oct 2026 - Present · Personal project · <https://github.com/chuan-khuna/wordle> · web, resume print, and CV print

- Build a Wordle solver in Python and Rust, with a GPUI desktop app and an interactive Next.js site that visualises its findings.

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
2. **Backend development** bullet: the work records say a teammate wrote the Django starter template. Is the template in the resume a different one?
3. **Sales data analysis** bullet: no work record shows association rule learning. Where was it used?
4. LDA topic modelling is not in the work records. The owner confirmed it on 2026-11-17.

---

## Full responsibility detail

The source for this section is the owner's work records, one file per project, in `D:\code\should-I-resign\what-i-have-done`. It lists only the work that the records say is the owner's. "Not mine" lists the parts that teammates built. Client names are left out. The newest project is first. Finished work is in the past tense, and ongoing work is in the present tense.

### Chatbot core template research

Nov 2026 - Present · AI and backend engineer, solo on this repository · in progress

- Researched how the pi, Tau, and Flue agent frameworks split into layers, from their source at pinned commits, and compared them with Pydantic AI and LangGraph.
- Proposed a layered design for a multi-client LINE and Facebook chatbot template: a provider layer, an agent loop, and a chat app layer with a public extension API.
- Proposed the tech stack with alternatives for each decision: FastAPI, SQLAlchemy and Alembic, PostgreSQL with pgvector and PyThaiNLP hybrid search, Next.js, and OpenTelemetry.
- Build a prototype core of about 2,400 lines on Tau, with strict mypy, released as versioned wheels to a local package registry.
- Proved the extension standard with three mock clients in three businesses. Each client adds its own tools and skills without editing the core, and upgrades by changing only the version pin.
- Isolated the Tau dependency behind one private bridge module, enforced by import-linter.
- Published the research and the design doc as an Astro Starlight site that reviewers read through pull requests.

Tools: Python, uv, Tau, OpenRouter, Pydantic, pytest, mypy, import-linter, Streamlit, Textual, just, mise, and Astro Starlight

### Company website upgrade

Nov 2026 · frontend engineer, joined an existing codebase · shipped

- Upgraded the live company website from Astro 5 to Astro 7, and from Tailwind CSS 3 to Tailwind CSS 4.
- Reorganised `src/` into per-area components, and moved all Strapi access into one library.
- Moved fonts to the Astro Font API and colours to OKLCH tokens.
- Built a Products section, with a typed product registry and a bilingual product page, from a written spec and tickets.
- Added a site-wide mourning mode, and polished the design system across 27 files.
- Added a 7-day minimum release age for new npm and bun packages.
- Wrote onboarding, deployment, and Thai content guides for the team.

Not mine: the original pages, the Strapi integration, the Express server, and the deployment scripts.

Tools: Astro, React, Tailwind CSS, Strapi, GraphQL, TypeScript, PM2, Nginx, Cloudflare, and Claude Code

### Parallel LLM serving evaluation

Oct 2026 · AI engineer, solo, one day · delivered report

- Traced why Ollama served Qwen 3.5 one request at a time to its scheduler source, which forces parallelism to 1 for hybrid architectures.
- Compared vLLM, SGLang, llama.cpp, and Ollama against six serving requirements, and recommended vLLM for the GPU server.
- Built an async Python benchmark CLI that streams concurrent requests to any OpenAI-compatible server and charts tokens over time for each request.
- Designed a late-arrival test for continuous batching. On vLLM, the late short request finished 18.7 s before the long one.

Limits: SGLang and llama.cpp were researched from documentation and source only. No run on the GPU server yet.

Tools: Python, httpx, rich, plotext, uv, just, vLLM, and Ollama

### Human-in-the-loop customer support chatbot

Sep 2026 - Present · backend and AI engineer, joined a team of 3 to 4 engineers · in progress

- Designed and built a document retrieval-augmented generation (RAG) subsystem. A background worker chunks each PDF or text, embeds it, and indexes it in Qdrant, with progress over Server-Sent Events (SSE).
- Wrote a chunker tuned for Thai, which ends sentences with a space.
- Moved the Django backend from WSGI to ASGI so that it can serve SSE.
- Built a retrieval eval that compared the old and new RAG. Recall@1 fell from 91.3% to 56.8%, so the new RAG stays behind a feature switch.
- Built a structured banknote table for 40 currencies to replace RAG prose that contradicted it.
- Built an LLM scan that finds conflicting and duplicate articles in the knowledge base.
- Replaced the one-call answer chain with a tool-calling agent of up to 4 steps, and kept the chain as a fallback.
- Built an eval runner that replays 633 customer test cases through the live pipeline, and a React app that compares runs side by side.
- Built a decision-model intent router that falls back to the keyword gate on error.
- Built a Bangkok rail-network model and a station-name resolver for a nearest-branch tool. This is still on a feature branch.

Not mine: the webhooks, the chain and its guardrails, booking, handoff, the operator dashboard, the first eval harness, and the multi-vector RAG.

Tools: Python, Django, Django REST Framework, PostgreSQL, Qdrant, Redis, Gemini embeddings, OpenRouter, React, Vite, Streamlit, Docker Compose, and just

### Decision-model research

Sep 2026 - Oct 2026 · full-stack and ML engineer, solo, about 10 days · shipped

- Evaluated two third-party decision models, Jev and Clef, against three past production problems.
- Built Thai survey sentiment analysis on Jev, with 11 typed questions per comment from a data-driven question set.
- Built a brand-recognition eval harness. Clef reached 100% top-1 accuracy on 44 labelled product images with no training, at about $0.0003 and under 1 s per image.
- Designed an image send policy that cut payloads from about 75 KB to about 16 KB.
- Prototyped an intent and handoff router that got the intent right on 41 of 43 test messages.
- Built a task delegation recommender that uses a written role charter and the live Jira load.
- Shipped it as a FastAPI and Next.js app with NDJSON streaming and about 250 tests.

Limits: the eval sets are small, and the survey is mock data without labels.

Tools: Python, FastAPI, Pydantic, httpx, OpenRouter, Next.js, React, TypeScript, Tailwind CSS, Streamlit, uv, just, and pytest

### Corporate marketing website prototype

May 2026 · web engineer, solo, AI-assisted with Claude Code · shipped

- Designed the architecture of a static-first site on Astro 6, deployed to Cloudflare Workers.
- Designed eight typed content collections as a CMS inside the repository.
- Built a scroll-driven storytelling page of 11 scenes with motion, lenis, and three.js.
- Designed a multi-preset OKLCH theme system.
- Wrote Claude Code skills that edit the content from plain-language requests.

Tools: Astro, TypeScript, React, shadcn/ui, Tailwind CSS, MDX, three.js, Cloudflare Workers, bun, and Claude Code

### Retail shelf computer vision platform

Mar 2026 - Present · full-stack and ML engineer, solo · in progress

- Build a full-stack platform with Next.js, Django REST Framework, and Modal serverless GPUs that turns shelf photos into brand facings, share of shelf, and Golden Line analytics.
- Moved inference from an always-on RabbitMQ consumer to Modal serverless functions.
- Train YOLO models, including a YOLO11-AMF variant, and RF-DETR models, with ONNX export. RF-DETR runs as a second engine, chosen per model weight.
- Built a model benchmark system that scores detection (per-class AP50, mAP50, and confusion matrix) and logo recognition separately.
- Showed that YOLO11m-AMF (mAP50 0.649) and RF-DETR-small (mAP50 0.613) have the same per-class profile, so the limit is the data. Small logos reach only AP50 0.543.
- Built a logo embedding index and an admin workflow that reviews unknown logos.
- Moved live progress onto Redis pub/sub so that it reaches clients on all 5 uvicorn workers, and moved jobs to Celery and Redis.
- Fixed shelf-level over-segmentation with a clustering threshold of median plus k times the median absolute deviation (MAD).
- Fixed a token-refresh race. Eight concurrent page loads went from 8 failures to 0.
- Ran a security and correctness audit of 38 findings in 16 tickets, and fixed the authorisation gaps and exposed debug pages.
- Deployed the platform to AWS EC2 behind Cloudflare Tunnel with no open inbound ports, using PM2 and Docker.

Tools: Python, Django, Django REST Framework, PostgreSQL, TimescaleDB, Redis, Celery, Modal, YOLO, RF-DETR, ONNX, supervision, Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Docker, AWS, Cloudflare Tunnel, uv, just, and Streamlit

### Classroom video attention study

Feb 2026 - Jun 2026 · system designer and data engineer, team of about 3 · shipped

- Designed the end-to-end system: capture, queue, process, store, and analyse.
- Built a PyQt6 recorder app, shipped as a Windows executable, that records the webcam in clips aligned to each lesson video. Pre-labelled clips cut the amount of video to process.
- Built a RabbitMQ worker that runs MediaPipe and OpenCV attention scoring and writes the results to PostgreSQL.
- Analysed attention by subject and topic together with survey forms, including Thai sentiment analysis with PyThaiNLP and an LLM through LangChain and Ollama.

Not mine: the attention algorithm, which came from a teammate, the Windows build script, and minor recorder UI fixes.

Tools: Python, PyQt6, OpenCV, MediaPipe, PyInstaller, RabbitMQ, PostgreSQL, ONNX, Docker Compose, pandas, PyThaiNLP, LangChain, Ollama, and Matplotlib

### Real-time CCTV people and security analytics

Nov 2025 - Present · owns the AI service and leads the backend, team of about 4 · in progress

- Build a real-time service that reads multi-camera RTSP streams with YOLOv11, RF-DETR, and ByteTrack to count people, detect weapons and metal objects, and embed faces.
- Lead the Django REST backend, with JWT and API-key auth, attendance in TimescaleDB hypertables, and dashboards on continuous aggregates.
- Built visitor management with face similarity search in pgvector.
- Integrated an Avigilon NVR for alarm sync and camera images.
- Added live check-in counts over Django Channels WebSockets.

Not mine: the core check-in and check-out controller (co-developed), the Modbus gate control, and the frontend.

Tools: Python, Django, Django REST Framework, Django Channels, PostgreSQL, TimescaleDB, pgvector, MinIO, YOLO, RF-DETR, ByteTrack, ONNX Runtime, OpenCV, Docker Compose, gunicorn, PM2, uv, and just

### Solar sensor data aggregation pipeline

Aug 2025 - Present · data engineer, solo · in progress

- Build an Airflow pipeline that down-samples solar and IoT sensor data from InfluxDB into 15-minute, hourly, and daily TimescaleDB tables.
- Cover 6 metric families in about 15 DAGs, each a thin config over shared tasks.
- Catch late data with offset time windows, and pin Flux queries to the Bangkok time zone.
- Make re-runs safe with idempotent upserts keyed on time, plant, and serial number.
- Add retries, timeouts, log cleanup, and Discord failure alerts.

Tools: Python, Apache Airflow, InfluxDB, Flux, TimescaleDB, pandas, Streamlit, Docker Compose, and uv

### Personalised video rendering service

Jul 2025 - Sep 2025 · backend engineer, primary builder in a team of 4 · shipped

- Built the FastAPI submit endpoint and the RabbitMQ worker of a service that renders personalised videos.
- Designed atomic task claiming so that 6 GPU workers never render the same job twice.
- Built a retry state machine of up to 3 retries, with a Discord alert on final failure.
- Built encoder auto-selection that tries the GPU first and falls back to the CPU.
- Built an Either-monad pipeline: text-to-speech, ffmpeg merge and concat, a vertical video, and S3 upload.

Not mine: the vertical-overlay generator (co-authored by a teammate) and the chat router.

Tools: Python, FastAPI, RabbitMQ, PostgreSQL, ffmpeg, AWS S3, Docker Compose with the NVIDIA runtime, and uv

### Road-safety video analytics platform

Jun 2025 - Present · backend and computer vision engineer, solo · in progress

- Build a computer vision library with a composable processor chain, with YOLO and RF-DETR behind one detector interface.
- Detect lane straddling with ByteTrack tracking and a frame-based dwell timer.
- Read licence plates with EasyOCR and a vision-language model through Ollama.
- Build a RabbitMQ worker that runs four pipelines per video (vehicles, accidents, pedestrians, and lane straddling), writes to TimescaleDB, and sends de-duplicated Discord and LINE alerts.
- Build the Django REST backend for video upload, task publishing, JWT auth, and dashboards on TimescaleDB materialised views.

Tools: Python, Django, Django REST Framework, PostgreSQL, TimescaleDB, RabbitMQ, YOLO, RF-DETR, ByteTrack, OpenCV, EasyOCR, LangChain, Ollama, Docker Compose, uv, and Bitbucket Pipelines

### Motor-show booth visitor analytics

Nov 2024 - Feb 2025 · backend and data engineering lead, team of about 5 · shipped

- Built an Airflow ETL that turns raw camera detections in MongoDB into hourly visitor counts and demographics per zone.
- Estimated unique visitors by embedding faces with DeepFace and clustering them with DBSCAN and HDBSCAN, with the vectors in Chroma.
- Built the Django REST backend for counts, demographics, face clusters, vector search, and CSV export.
- Set up Docker Compose, Nginx, Let's Encrypt, Prometheus, Grafana, and Bitbucket Pipelines.
- Contributed chart components and some dashboard pages to the React frontend.

Not mine: most of the frontend.

Tools: Python, Apache Airflow, MongoDB, Chroma, DeepFace, scikit-learn, Django, Django REST Framework, Docker Compose, Nginx, Prometheus, Grafana, React, and TypeScript

### Legacy point-of-sale sync and membership analytics

Aug 2024 - Feb 2025 · data and backend engineer, team of about 6 · shipped

- Extended a teammate's Debezium stack with a JDBC sink, which replicated 7 tables from MySQL to PostgreSQL. Also trialled Maxwell.
- Replaced change data capture in production with an Airflow DAG factory that makes one idempotent, windowed sync per table.
- Built an RFM segmentation DAG that runs every 12 hours.
- Fixed a slow top-products endpoint by moving the aggregation into a pre-computed, indexed table.
- Built the Django REST dashboard APIs, from v1 to v4.
- Fixed a duplicate JWT bug, and set up the back-office deploy with Bitbucket Pipelines and PM2.

Not mine: the Debezium source setup, the Django starter template, the data models, and most of the back-office UI.

Tools: Python, Apache Airflow, Debezium, Kafka Connect, Kafka, MySQL, PostgreSQL, Django, Django REST Framework, pandas, Docker Compose, Bitbucket Pipelines, React, and Recharts

### Internal forum scraping pipeline

Dec 2023 - Jun 2025 · backend and data engineer, solo · shipped

- Built a Django REST API and a RabbitMQ worker that scrape forum posts and comments on demand.
- Wrote layered scraper clients (search, topic, and comments), run in parallel with multiprocessing.
- Handled failures with User-Agent rotation, timeouts, and an Either monad that skips a bad page.
- Stored raw results in MongoDB, and job and credit logs in PostgreSQL.
- Built text preprocessing, including RFM segmentation, and a Streamlit app to explore the data.
- Set up Docker Compose, Nginx, Let's Encrypt, and Bitbucket Pipelines.

Tools: Python, Django REST Framework, RabbitMQ, MongoDB, PostgreSQL, BeautifulSoup, Streamlit, pandas, Docker Compose, Nginx, and Bitbucket Pipelines

### Employee engagement survey analytics

May 2023 - May 2025 · data and backend engineer, team of about 4 · shipped

- Co-built the SQL and pandas layer that flattens survey data from SQL Server, in an even split with a teammate.
- Owned Thai text analytics in the Flask backend: PyThaiNLP tokenisation, n-grams, stopwords, and word clouds.
- Owned the reporting module of the Flask backend.
- Used LDA topic modelling on survey responses.
- Built a Streamlit demo, solo, that classifies free-text comments into engagement themes with an LLM.

Not mine: the RabbitMQ consumer, the database layer, and the IIS deployment.

Tools: Python, Flask, RabbitMQ, SQL Server, pandas, PyThaiNLP, wordcloud, Streamlit, and Docker Compose

### Real-time crowd analytics expo demo

Apr 2023 - Jul 2024 · full-stack and computer vision engineer, primary builder in a team of about 3 · shown at a marketing expo

- Built a Kafka pipeline: a frame producer, detection and recognition consumers, and a WebSocket dashboard, shown live at a marketing expo.
- Built face detection with MediaPipe over RTSP, movement heatmaps, and face recognition backed by ChromaDB and Weaviate.
- Built real-time dashboards in Next.js and in Flask with Socket.IO.
- Built a Streamlit dashboard on YOLOv8 and supervision for count in zone, time in zone, and Sankey flows.

Not mine: the age, gender, and emotion models.

Tools: Python, Kafka, MediaPipe, YOLOv8, supervision, OpenCV, DeepFace, ChromaDB, Weaviate, Streamlit, Flask, Next.js, and Docker Compose

### LINE loyalty programme analytics

Feb 2023 - May 2023, with follow-ups to Mar 2025 · data and backend engineer, team of 4 to 6 · shipped

- Designed and built an RFM engine in pandas that scores members into 125 RFM codes, named segments, and 4 spend tiers, refreshed daily by Celery.
- Did exploratory analysis in notebooks, including demographic, geographic, and cohort analysis.
- Built the admin analytics and CSV export APIs.
- Built the admin dashboard in React, with Nivo charts and Leaflet maps.
- Built seed data and the first test suite.

Not mine: the core loyalty flows, campaigns, LINE notifications, and the deployment.

Tools: Python, Django, Django REST Framework, PostgreSQL, Celery, Redis, pandas, pytest, React, Nivo, and Leaflet
