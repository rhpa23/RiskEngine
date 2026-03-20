import type {Metadata} from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Risk Engine Enterprise',
  description: 'Plataforma de gestão de riscos de nível empresarial',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable}`}>
      <body suppressHydrationWarning className="font-body bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
