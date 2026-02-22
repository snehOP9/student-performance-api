import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Performance Predictor",
  description: "Dynamic UI generated from FastAPI OpenAPI schema",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
        {children}
      </body>
    </html>
  );
}