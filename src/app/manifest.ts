import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Mentor - UPSC 2027',
    short_name: 'My Mentor',
    description: 'Personal study planner, syllabus coverage tracker, and calm mentor for UPSC CSE 2027.',
    start_url: '/today',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#1e6b52',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: "Today's Plan",
        url: '/today',
        description: 'View and track daily study plan',
      },
      {
        name: 'Syllabus Tracker',
        url: '/syllabus',
        description: 'Check UPSC 2027 syllabus coverage',
      },
      {
        name: 'Progress & Revisions',
        url: '/progress',
        description: 'Spaced repetition and weekly analytics',
      },
    ],
  };
}
