import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import MenteeProvider from '@/components/MenteeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jornada Protagonista',
  description: 'Sistema de acompanhamento da Jornada Protagonista',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <MenteeProvider>
          <Sidebar />
          <main className="ml-64 min-h-screen p-6 lg:p-8">
            {children}
          </main>
        </MenteeProvider>
      </body>
    </html>
  );
}
