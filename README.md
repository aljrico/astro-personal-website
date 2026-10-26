# aljrico.com

Alejandro Jimenez Rico's personal site: projects first, writing second. Built with Astro and hosted on Netlify.

## Commands

| Command        | Action                                    |
| :------------- | :---------------------------------------- |
| `pnpm install` | Install dependencies                      |
| `pnpm dev`     | Start the dev server at `localhost:4321`  |
| `pnpm build`   | Build the site to `./dist/`               |
| `pnpm check`   | Type-check the site and content           |
| `pnpm preview` | Preview the build locally                 |

## Where things live

- Projects (homepage list and app pages): `src/data/projects.ts`
- Posts: `src/content/post/`
- Devlog: `src/content/devlog/`
- App privacy, terms and support pages: `src/content/apps/`
- Frontmatter schemas: `src/content/config.ts`. The build fails on frontmatter that breaks them.
- Open Graph images are generated with Satori in `src/utils/og-card.ts`.

## License

MIT
