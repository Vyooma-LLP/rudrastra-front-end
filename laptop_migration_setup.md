# Vyooma AI & Development Setup Guide

Here is the complete and detailed blueprint of our setup. Categorized below are all the tools, skills, and configurations we rely on so you can easily recreate this environment on your new laptop.

## 1. The Core AI Environment (Antigravity / Gemini)

This is the heart of our pair programming and AI automation setup. Your AI assistant uses a highly customized environment loaded with specific skills, plugins, and servers.

*   **Configuration Directory:** `~/.gemini/`
    *   *Migration Tip:* To keep all your agent's knowledge, skills, and configurations, simply copy the entire `/Users/vyooma/.gemini/` directory to the same path on your new laptop.
*   **Active Model:** Gemini 3.1 Pro (High)
*   **MCP Servers (Model Context Protocol):** We use these to give the AI access to external platforms securely.
    *   `notebooklm-mcp` & `notebooks`: For interfacing with NotebookLM (creating, querying, and managing research notebooks).
    *   `datacloud_*_remote` (BigQuery, Cloud SQL, Spanner, Knowledge Catalog): For remote database operations and querying.
    *   `visualization`: For rendering charts and data applications.
    *   `context7`: For library and context resolution.
*   **Active Plugins:**
    *   `googlecloudtools.datacloud_telemetry`

## 2. Knowledge Management & Research

These are the tools we use for taking notes, organizing research, and understanding complex data/codebases.

*   **Obsidian:**
    *   **Use Case:** Our primary offline, Markdown-based knowledge base.
    *   **Setup:** Make sure you install Obsidian on the new laptop and sync your existing Vault (usually via iCloud, Git, or Obsidian Sync).
*   **NotebookLM:**
    *   **Use Case:** Our AI-powered research assistant. We use it to ground our queries in specific source documents, synthesize long PDFs (like the `Why Vyooma.pdf`), and do cross-notebook queries.
    *   **Setup:** It is accessed via the web, but our integration relies on the `notebooklm-mcp` server located in your `~/.gemini/mcp/` directory. You may need to refresh the auth tokens (`refresh_auth`) once you move.
*   **Graphify:**
    *   **Use Case:** An incredibly powerful custom skill (`graphify`) we use to turn the codebase, documents, and references into a persistent knowledge graph. It allows the AI to perform deep community detection and path/explain queries across your entire project.
    *   **Setup:** This lives in `~/.gemini/config/skills/graphify/`. Just copying the `.gemini` folder will bring this over.

## 3. Web Development Stack

Based on our current work (like the `VyoomaHeroPage` project), here is our frontend engineering setup.

*   **Node.js & npm:** The core runtime. Make sure to install the latest LTS version of Node.js on the new Mac.
*   **Frameworks:** React with TypeScript (`.tsx`), often powered by Vite or Next.js depending on the specific web app.
*   **Styling:** Vanilla CSS (`index.css`) emphasizing modern, rich aesthetics (glassmorphism, micro-animations, vibrant gradients) over utility frameworks like Tailwind (unless explicitly requested).
*   *Migration Tip:* Once Node is installed, you'll just need to run `npm install` inside your project directories (e.g., `/Users/vyooma/Desktop/VyoomaHeroPage`) before running `npm run dev`.

## 4. Data Cloud & GCP Infrastructure

We have a massive suite of data engineering and database skills installed. If we ever need to do data work, the agent is fully equipped.

*   **Databases:** Deep integration and skills for BigQuery, Cloud SQL (PostgreSQL, MySQL, SQL Server), AlloyDB (Omni & Postgres), and Spanner.
*   **Data Pipelines:** Skills configured for Apache Airflow/Composer, Dataflow (Apache Beam), Dataproc (Spark), dbt, and Dataform.
*   **Setup requirement:** You will need to install the Google Cloud CLI (`gcloud`) on your new laptop and authenticate it by running:
    *   `gcloud auth login`
    *   `gcloud auth application-default login` (Crucial for the AI to interact with GCP resources on your behalf).

---

## Your 3-Step Migration Checklist

1. **Transfer the Brain:** Copy the `~/.gemini` directory from your old Mac to the new Mac. This instantly restores Graphify, your MCP server configurations (NotebookLM, Data Cloud), and all your custom rules/skills.
2. **Setup the Dev Environment:** Install **Node.js** (for npm), **Obsidian**, and the **Google Cloud CLI**.
3. **Sync your Files:** Transfer your Obsidian Vault and your coding workspaces (like your `Downloads/VyoomaHeroPage` folder). Run `npm install` in your web projects, and log back into `gcloud`.
