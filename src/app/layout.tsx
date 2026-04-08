import type { Metadata } from "next";
import { Outfit, Kalam, Birthstone } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["400", "700"],
});

const signature = Birthstone({
  subsets: ["latin"],
  variable: "--font-signature",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Brain OS",
  description: "Personal Second Brain System",
  icons: {
    icon: "/cbos.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${kalam.variable} ${signature.variable}`}>
      <body className="font-sans antialiased bg-white text-black">
        <div className="min-h-[100dvh] transition-all duration-300">
          {children}
        </div>
      </body>
    </html>
  );
}
