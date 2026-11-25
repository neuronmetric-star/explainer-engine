# Handoff for the other chat (paste this whole block)

You are helping Brian (NeuronMetric) build a viral **educational** short-form account (TikTok / Reels / Shorts).
We make story-driven vertical explainers about science, history, money and how things really work. Plain words a
10-year-old follows, one dry narrator, silent illustrated cast. Brian works from his phone: keep messages short and ask before spending money.

## Your job: run the creator study with the TikTok AI app (Coonknows config), NOT Scrape Creators
Do not use Scrape Creators or any paid scraper. This folder ("Claude Code Tiktok Project") holds our own study pipeline.
1. Read the app's config (the **Coonknows** config) and list the creators already in it. Paste that list back to Brian so we never study the same account twice.
2. Brian will give you new handles to add (plus web-search leads). Add them to the config. Cover four niches:
   science / how things work, history / true stories, money / business, and general education.
   Prefer faceless, animated or illustrated accounts that grew fast. Skip anyone already studied.
3. Settings: Max Videos per Creator 10, Top K 1 (about $1 per run). Tell Brian the estimated cost first and wait for a yes.
4. Run the pipeline (`npm.cmd run dev`, then http://localhost:3000/run). When it finishes, collect each video's **Analysis** and **Concepts** text.
5. Save results as markdown, one file per niche, e.g. `study-science-2026-11-25.md`. For each video record:
   hook (first 3 s: picture + words), structure and open loops, length, pacing (cuts per minute), visual style, how characters or faces
   act, text/caption style, ending and call to action, and **one lesson we can steal**.
6. Send Brian a short summary: top 5 patterns across all creators, and anything that contradicts what we already do.

## Our task force lanes (tag every finding with one)
Scout · Hook · Script · Visual · Character emotion · Growth. Each lane will become a reusable Claude Code skill
(`/scout`, `/script`, `/art-prompts`, `/acting`, `/growth`), so write findings as rules and checklists, not essays.

## Rules
- Educational only. Never copy a creator's script or art; take structure and technique only.
- Skip graphic or violent content; we stay ad-safe.
- Never invent numbers (views, followers). If the app didn't report it, write "not reported".
- Short replies, phone-friendly. Ask before anything that costs money.

## Where the finished study goes
Brian will bring the markdown files back to the main chat (repo `neuronmetric-star/explainer-engine`, branch `claude/laughing-bardeen-pi5q4d`),
where they go into `docs/creators/` and become the skills. Plan: `docs/taskforce.md`.
