import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brain OS",
  description: "Personal Second Brain System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark`}>
      <body className="font-sans antialiased bg-titanium-950 text-titanium-50">
        <div className="min-h-[100dvh] transition-all duration-300">
          {children}
        </div>
      </body>
    </html>
  );
}
