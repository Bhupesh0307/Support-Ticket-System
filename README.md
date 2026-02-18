# Ticket Classifier App

A full-stack demo application for creating, managing, and automatically classifying helpdesk tickets using an LLM (Large Language Model).

---

## Overview

This project is a ticket management system with automatic ticket classification (category and priority) using Google's Gemini LLM. It consists of:

- **Backend:** Django + Django REST Framework.
- **Frontend:** React.
- **Database:** PostgreSQL.
- **LLM:** Google Gemini, accessed via the `google-generativeai` Python package.

---

## Features

- Submit new tickets with title and description.
- Real-time, LLM-powered auto-classification of ticket category and priority as you type the description.
- List all tickets with status and metadata.
- Stats dashboard for ticket overview.
- Modern React frontend (with Axios) + RESTful Django backend.

---

## Setup Instructions

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine.
- (Optional) Google Cloud account to obtain Gemini API key (see below).

### 1. Clone the Repository

```bash
git clone <this-repo>
cd <this-repo>
```

### 2. Set Your Gemini API Key

1. Obtain an API key for [Google Gemini Pro](https://aistudio.google.com/app/apikey) and copy it.
2. Paste your key into the `.env` file at the root (already present):

```
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

### 3. Start the App (All Services)

From the project root, run:

```bash
docker-compose up --build
```

This spins up:
- PostgreSQL (on port 5432)
- Django backend (on port 8000)
- React frontend (on port 3000)

### 4. Access the Frontend

Open your browser to:  
[http://localhost:3000](http://localhost:3000)

---

## LLM Details

### Which LLM?

**Google Gemini Pro** (`google-generativeai`).

### Why Gemini?

- **Accessible API:** The Gemini API via `google-generativeai` is easy to set up without complex authentication.
- **Speed:** Good latency and performance for classification tasks.
- **Accuracy:** Modern LLM that returns reliable zero-shot classifications.
- **Simple integration:** Python SDK is convenient for backend use.

---

## Design Decisions

- **React + Django:** Clean separation of concerns, quick API/prototyping.
- **LLM-in-the-loop:** The Django backend exposes an endpoint (`/api/tickets/classify/`) that leverages Gemini to suggest a category and priority from textual ticket description.
- **Dockerized:** For simple, reproducible setup (no local Python/node setup required).
- **No login/auth:** Focus is on classification, not user management.
- **CORS Enabled:** Allow frontend to talk to backend locally.
- **Environment-Driven Secret Management:** Sensitive keys (Gemini API) are taken from environment vars. (Never check your real API key into source control.)
- **Postgres for Realism:** Using Postgres via Docker for realistic persistence, in line with typical Django deployments.

---

## Customization

- **Categories and priorities:** Adjust how tickets are classified by changing the system prompt in the backend or extending the serializer/model.
- **Styling:** The React frontend is minimal and easily themed or extended.

---

## Troubleshooting

- If the backend cannot access Gemini, check your `.env` file has a valid key and restart the backend container.
- Make sure ports 5432, 8000, and 3000 are free.

---
In future, whenever you change models:

Always run:

docker-compose run backend python manage.py makemigrations
docker-compose run backend python manage.py migrate
---