import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DriveMind Chatbot",
  description: "DriveMind assistant runtime (Otto). Serves the embeddable widget and query API.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // No Tailwind here on purpose: the embeddable widget ships its own scoped
  // styles (shadow DOM / iframe) so it never clashes with a host page.
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>{children}</body>
    </html>
  );
}
