import { NextResponse } from "next/server";

/**
 * llms.txt — AI-friendly documentation index
 *
 * Dynamic route handler that generates an llms.txt file listing
 * all documentation pages with absolute URLs.
 *
 * @see https://llmstxt.org/
 */

const SITE_BASE = "https://docs.credat.dev";

/** Mirrors src/content/_meta.ts */
const topPages = [
  { title: "Introduction", path: "/docs" },
  { title: "Getting Started", path: "/docs/getting-started" },
  { title: "CLI Reference", path: "/docs/cli" },
  { title: "Security Considerations", path: "/docs/security" },
  { title: "Troubleshooting", path: "/docs/troubleshooting" },
];

/** Mirrors src/content/concepts/_meta.ts */
const conceptsPages = [
  { title: "Architecture Overview", path: "/docs/concepts/architecture" },
  { title: "Agent Identity", path: "/docs/concepts/agent-identity" },
  { title: "Delegation", path: "/docs/concepts/delegation" },
  { title: "Trust Handshake", path: "/docs/concepts/handshake" },
  { title: "Scopes & Constraints", path: "/docs/concepts/scopes" },
];

/** Mirrors src/content/guides/_meta.ts */
const guidesPages = [
  { title: "Create Your First Agent", path: "/docs/guides/basic-agent" },
  { title: "Issue & Verify Delegations", path: "/docs/guides/delegation" },
  { title: "Delegation Chains", path: "/docs/guides/delegation-chains" },
  { title: "Enforce Delegation Constraints", path: "/docs/guides/constraints" },
  { title: "Implement the Trust Handshake", path: "/docs/guides/handshake" },
  { title: "Credential Revocation", path: "/docs/guides/revocation" },
  { title: "Agent-to-Agent Trust", path: "/docs/guides/agent-to-agent" },
  { title: "MCP Integration", path: "/docs/guides/mcp" },
];

/** Mirrors src/content/api/_meta.ts */
const apiPages = [
  { title: "Agent", path: "/docs/api/agent" },
  { title: "Delegation", path: "/docs/api/delegation" },
  { title: "Credentials", path: "/docs/api/credentials" },
  { title: "Handshake", path: "/docs/api/handshake" },
  { title: "Scopes", path: "/docs/api/scopes" },
  { title: "Revocation", path: "/docs/api/revocation" },
  { title: "Crypto", path: "/docs/api/crypto" },
  { title: "DID", path: "/docs/api/did" },
  { title: "Types", path: "/docs/api/types" },
  { title: "Errors", path: "/docs/api/errors" },
];

function fmt(pages: { title: string; path: string }[]): string {
  return pages
    .map((p) => `- ${p.title} [${p.path}](${SITE_BASE}${p.path})`)
    .join("\n");
}

function generateLlmsTxt(): string {
  return [
    "# Credat Docs",
    "> Give your AI agents verifiable identity, scoped permissions, and cryptographic trust.",
    `> Powered by: https://github.com/credat/credat`,
    "",
    "## Overview",
    fmt(topPages),
    "",
    "## Concepts",
    fmt(conceptsPages),
    "",
    "## Guides",
    fmt(guidesPages),
    "",
    "## API Reference",
    fmt(apiPages),
    "",
    `> Full documentation: ${SITE_BASE}/docs`,
  ].join("\n");
}

export async function GET() {
  const body = generateLlmsTxt();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
