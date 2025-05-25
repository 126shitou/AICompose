import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/language-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NexusAI - Advanced AI Platform',
  description: 'Explore the future of AI with chat, image, video, and audio generation capabilities',
  keywords: 'AI, artificial intelligence, chat, image generation, video generation, text to speech, machine learning',

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ marginRight: '0px !important' }}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <LanguageProvider>
              <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-pink-50 dark:from-[#0A1A2F] dark:to-[#160B2E] text-foreground">
                <Navigation />
                <main className="container mx-auto px-4 pb-8 pt-20">
                  {children}
                </main>
                <Toaster />
              </div>
            </LanguageProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}