# Alejandro's Personal Site

A pseudo-CV first, a blog second. Projects matter most; the writing supports them.

## Writing

Like Steph Ango, Naval, Paul Graham. Short sentences, short paragraphs, short posts. Concrete over abstract. No jargon, no hedging, no corporate speak. Admit when things were hard. No em-dashes.

## Where things live

- Projects (homepage list and app pages): `src/data/projects.ts`
- Posts: `src/content/post/`, devlog: `src/content/devlog/`
- Astro, hosted on Netlify. The build fails on frontmatter that breaks `src/content/config.ts`.

## Frontmatter limits

- Post: `title` ≤ 60 chars, `description` 50–160 chars
- Devlog: `description` 10–200 chars
- `publishDate: "DD Month YYYY"`

## Commits

Simple and descriptive. No signatures or attribution lines.
