import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BIOSPHERE MATRIX | Climate Intelligence Platform',
  description: 'Real-time global ecological data tracking and environmental anomaly detection system',
  keywords: ['climate', 'environment', 'telemetry', 'sustainability', 'dashboard', 'data visualization'],
  authors: [{ name: 'Biosphere Matrix Team' }],
  openGraph: {
    title: 'BIOSPHERE MATRIX',
    description: 'The future of climate intelligence is here',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable + ' ' + jetbrainsMono.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
