# Support Ticket System

A full‑stack support ticket system that lets users submit, browse, filter, and analyze tickets, with automatic LLM‑powered suggestions for category and priority.

---

## Overview

This project is an end‑to‑end implementation of the **Tech Intern Assessment**:

- **Backend:** Django + Django REST Framework (DRF)
- **Frontend:** React (Axios for API calls)
- **Database:** PostgreSQL (via Docker)
- **LLM:** Google Gemini, via the `google-generativeai` Python package

The entire app runs with a single:

```bash
docker-compose up --build
```

Once a valid API key is provided, no additional manual setup is required.

---

## Features

- **Submit tickets**
  - Title (required, max 200 chars)
  - Description (required)
  - Category and priority dropdowns (editable)
  - Real‑time LLM‑powered auto‑suggestion of category + priority while typing the description

- **Ticket list**
  - Newest‑first list of all tickets
  - Shows title, description, category, priority, status, timestamps
  - Filter bar for **category**, **priority**, and **status**
  - Search bar wired to `?search=` (filters by title + description)
  - Inline status change (e.g. `open → in_progress → resolved/closed`) via `PATCH /api/tickets/{id}/`

- **Stats dashboard**
  - Total tickets
  - Open tickets
  - Average tickets per day
  - Priority breakdown
  - Category breakdown
  - Auto‑refreshes when tickets change

- **API design**
  - `POST /api/tickets/` – create ticket
  - `GET /api/tickets/` – list tickets (supports `?category=`, `?priority=`, `?status=`, `?search=`)
  - `PATCH /api/tickets/<id>/` – update ticket (status, category, priority, etc.)
  - `GET /api/tickets/stats/` – stats using database‑level aggregation only
  - `POST /api/tickets/classify/` – LLM‑powered classification for category + priority

---

## Setup Instructions

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- A Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone the repository

```bash
git clone <this-repo>
cd <this-repo>
```

### 2. Configure environment variables

From the project root, copy the example environment file and set your key:

```bash
cp .env.example .env
```

Edit `.env` and set:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

> **Note:** The real API key is **not** committed to the repo. It is only read from environment variables.

The frontend reads the backend URL from `REACT_APP_API_BASE`, which defaults to `http://localhost:8000` if not provided, so no extra config is required for local Docker.

### 3. Start all services

From the project root:

```bash
docker-compose up --build
```

This will start:

- **PostgreSQL** on `5432`
- **Django backend** on `8000`
- **React frontend** on `3000`

The backend container waits briefly, runs migrations, and then starts the dev server, so no manual `migrate` step is needed for reviewers.

### 4. Open the app

Navigate to:

```text
http://localhost:3000
```

You can then:

- Type a description and watch category/priority auto‑fill via the LLM
- Submit tickets
- Filter/search the ticket list
- Change statuses
- View the stats dashboard

---

## LLM Details

### Which LLM?

- **Google Gemini** (via `google-generativeai`)

### Why Gemini?

- **Simple auth** – API key based, easy to inject via env vars
- **Good latency** – Fast enough for real‑time form suggestions
- **Accuracy** – Strong zero‑shot classification for short text
- **Nice Python SDK** – Clean integration in Django/DRF

### Prompt + behavior

- The backend sends a structured prompt listing the **allowed categories** (`billing`, `technical`, `account`, `general`) and **allowed priorities** (`low`, `medium`, `high`, `critical`).
- The LLM is asked to return **only JSON** with `suggested_category` and `suggested_priority`.
- If the LLM fails or is unreachable, a **fallback classifier** runs on the backend so ticket creation still works (just without smart suggestions).

---

## Design Decisions

- **React + Django** for clear separation of frontend and API.
- **Django REST Framework** for robust serialization, filtering, and generic views.
- **LLM‑in‑the‑loop** via `/api/tickets/classify/` so the frontend can remain simple and stateless.
- **Dockerized stack** to ensure one‑command setup (`docker-compose up --build`).
- **PostgreSQL** to match typical production‑style deployments.
- **CORS + env‑based config** so the React app can talk to the backend in local/dev environments.
- **Environment‑driven secrets** – API keys come only from env vars (`.env` / Docker env), never from hard‑coded literals.

---

## Customization

- **Ticket schema:** Extend the `Ticket` model and DRF serializer to add more fields (e.g. tags, assignee).
- **LLM behavior:** Tweak the prompt in `tickets/llm.py` to change how category/priority are suggested.
- **Filters/search:** Add additional filters or change how search behaves in the DRF view.
- **Styling:** The React UI is componentized and uses inline styles; you can switch to Tailwind, CSS modules, or a design system easily.

---

## Troubleshooting

- **LLM errors / no suggestions**
  - Double‑check `.env` has a valid `GEMINI_API_KEY`.
  - Restart the stack after changing env vars:

    ```bash
    docker-compose down
    docker-compose up --build
    ```

- **Ports already in use**
  - Ensure nothing else is running on `5432`, `8000`, or `3000`.

- **Local development (optional)**
  - If you develop locally outside Docker and change models, you can run:

    ```bash
    cd backend
    python manage.py makemigrations
    python manage.py migrate
    ```

  - This is **not required** for reviewers running only `docker-compose up --build`.

---

This project is designed so that assessors can clone it, add a `.env` with a valid Gemini key, run `docker-compose up --build`, and have a working end‑to‑end support ticket system with LLM‑powered classification.*** End Patch***} ***!