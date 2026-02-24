# Credat Docs

Documentation site for [Credat](https://github.com/credat/credat) — the trust layer for AI agents.

**Live at [docs.credat.io](https://docs.credat.io)**

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Nextra 4](https://nextra.site) (docs theme + MDX)
- Deployed on [Vercel](https://vercel.com)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/content/
├── index.mdx                 # Introduction
├── getting-started.mdx       # Installation & quick start
├── security.mdx              # Security considerations
├── concepts/                 # Core concepts
│   ├── agent-identity.mdx
│   ├── delegation.mdx
│   ├── handshake.mdx
│   └── scopes.mdx
├── guides/                   # Step-by-step tutorials
│   ├── basic-agent.mdx
│   ├── delegation.mdx
│   ├── handshake.mdx
│   └── agent-to-agent.mdx
└── api/                      # API reference
    ├── agent.mdx
    ├── delegation.mdx
    ├── handshake.mdx
    ├── scopes.mdx
    ├── crypto.mdx
    ├── did.mdx
    └── errors.mdx
```

## Deployment

Pushes to `main` trigger automatic production deployments via Vercel.

## License

MIT
