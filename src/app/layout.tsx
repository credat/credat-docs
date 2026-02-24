import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Credat - Trust Layer for AI Agents",
    template: "%s - Credat Docs",
  },
  description:
    "Give your AI agents verifiable identity, scoped permissions, and cryptographic trust. The missing trust layer for autonomous agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
