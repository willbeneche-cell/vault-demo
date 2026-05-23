import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🟢 MODIFICATION ICI : On configure les infos pour tous les navigateurs + Apple
export const metadata: Metadata = {
  title: "Vault",
  description: "Vault Protocol Engine",
  appleWebApp: {
    capable: true, // <-- Dit à l'iPhone de masquer les barres Safari (mode appli plein écran)
    statusBarStyle: "black-translucent",
    title: "Vault",
  },
  icons: {
    icon: "/icon.png",        // Pour PC, Android et les onglets classiques
    apple: "/apple-icon.png",  // Pour l'écran d'accueil de l'iPhone (Apple Touch Icon)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}