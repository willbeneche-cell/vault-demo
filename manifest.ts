// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vault',
    short_name: 'Vault',
    description: 'Vault Protocol Engine',
    start_url: '/',
    display: 'standalone', // <-- Cache les barres du navigateur pour faire "appli"
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}