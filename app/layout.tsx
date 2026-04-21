import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  icons: {
  icon: "/favicon.svg",
},
  title: "VirtuCare — Virtual Healthcare",
  description: "Book appointments with top doctors, anytime, anywhere.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
