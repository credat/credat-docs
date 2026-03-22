import { NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * llms-full.txt — Complete documentation content for AI consumption
 *
 * Reads all MDX content files at build time and produces a single
 * markdown file with the full text of every documentation page.
 *
 * @see https://llmstxt.org/
 */

const SITE_BASE = "https://docs.credat.dev";
const CONTENT_DIR = join(process.cwd(), "src", "content");

/** Mirrors src/content/_meta.ts — ordered page entries */
const topPages = [
  { title: "Introduction", file: "index.mdx", path: "/docs" },
  { title: "Getting Started", file: "getting-started.mdx", path: "/docs/getting-started" },
  { title: "CLI Reference", file: "cli.mdx", path: "/docs/cli" },
  { title: "Security Considerations", file: "security.mdx", path: "/docs/security" },
  { title: "Troubleshooting", file: "troubleshooting.mdx", path: "/docs/troubleshooting" },
];

const sections: { heading: string; pages: { title: string; file: string; path: string }[] }[] = [
  {
    heading: "Concepts",
    pages: [
      { title: "Architecture Overview", file: "concepts/architecture.mdx", path: "/docs/concepts/architecture" },
      { title: "Agent Identity", file: "concepts/agent-identity.mdx", path: "/docs/concepts/agent-identity" },
      { title: "Delegation", file: "concepts/delegation.mdx", path: "/docs/concepts/delegation" },
      { title: "Trust Handshake", file: "concepts/handshake.mdx", path: "/docs/concepts/handshake" },
      { title: "Scopes & Constraints", file: "concepts/scopes.mdx", path: "/docs/concepts/scopes" },
    ],
  },
  {
    heading: "Guides",
    pages: [
      { title: "Create Your First Agent", file: "guides/basic-agent.mdx", path: "/docs/guides/basic-agent" },
      { title: "Issue & Verify Delegations", file: "guides/delegation.mdx", path: "/docs/guides/delegation" },
      { title: "Delegation Chains", file: "guides/delegation-chains.mdx", path: "/docs/guides/delegation-chains" },
      { title: "Enforce Delegation Constraints", file: "guides/constraints.mdx", path: "/docs/guides/constraints" },
      { title: "Implement the Trust Handshake", file: "guides/handshake.mdx", path: "/docs/guides/handshake" },
      { title: "Credential Revocation", file: "guides/revocation.mdx", path: "/docs/guides/revocation" },
      { title: "Agent-to-Agent Trust", file: "guides/agent-to-agent.mdx", path: "/docs/guides/agent-to-agent" },
      { title: "MCP Integration", file: "guides/mcp.mdx", path: "/docs/guides/mcp" },
    ],
  },
  {
    heading: "API Reference",
    pages: [
      { title: "Agent", file: "api/agent.mdx", path: "/docs/api/agent" },
      { title: "Delegation", file: "api/delegation.mdx", path: "/docs/api/delegation" },
      { title: "Credentials", file: "api/credentials.mdx", path: "/docs/api/credentials" },
      { title: "Handshake", file: "api/handshake.mdx", path: "/docs/api/handshake" },
      { title: "Scopes", file: "api/scopes.mdx", path: "/docs/api/scopes" },
      { title: "Revocation", file: "api/revocation.mdx", path: "/docs/api/revocation" },
      { title: "Crypto", file: "api/crypto.mdx", path: "/docs/api/crypto" },
      { title: "DID", file: "api/did.mdx", path: "/docs/api/did" },
      { title: "Types", file: "api/types.mdx", path: "/docs/api/types" },
      { title: "Errors", file: "api/errors.mdx", path: "/docs/api/errors" },
    ],
  },
];

/**
 * Read an MDX file and strip the YAML frontmatter (if present).
 * Returns the raw markdown/MDX content without the --- fences.
 */
function readMdx(relativePath: string): string {
  try {
    let raw = readFileSync(join(CONTENT_DIR, relativePath), "utf-8");
    // Strip YAML frontmatter
    if (raw.startsWith("---")) {
      const end = raw.indexOf("---", 3);
      if (end !== -1) {
        raw = raw.slice(end + 3).replace(/^\n/, "");
      }
    }
    return raw.trim();
  } catch {
    return "";
  }
}

function generateLlmsFullTxt(): string {
  const lines: string[] = [
    "# Credat Docs — Full Content",
    "> Complete documentation for the Credat trust layer for AI agents.",
    `> Powered by: https://github.com/credat/credat`,
    "",
  ];

  // Top-level pages
  for (const page of topPages) {
    const content = readMdx(page.file);
    lines.push(`## ${page.title}`, `> ${SITE_BASE}${page.path}`, "", content, "");
  }

  // Sectioned pages
  for (const section of sections) {
    lines.push(`# ${section.heading}`, "");
    for (const page of section.pages) {
      const content = readMdx(page.file);
      lines.push(`## ${page.title}`, `> ${SITE_BASE}${page.path}`, "", content, "");
    }
  }

  return lines.join("\n");
}

export async function GET() {
  const body = generateLlmsFullTxt();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
