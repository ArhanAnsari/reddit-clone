import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanity Admin",
  description: "Sanity Admin Dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
