// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vault',
  description: 'Vault Protocol Engine',
  appleWebApp: {
    capable: true, // <-- Force Apple à l'ouvrir comme une appli
    statusBarStyle: 'black-translucent',
    title: 'Vault',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png', // <-- Apple chargera cette image pour l'écran d'accueil
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}