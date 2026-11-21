import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import FacebookPixel from '@/components/FacebookPixel';

export const metadata: Metadata = {
  title: 'Girlsgalary | Ladies Ecommerce - Saree, Three Piece, Kurti, Cosmetics & Jewellery',
  description: 'Girlsgalary is your premier online destination for authentic ladies fashion in Bangladesh. Discover Dhakai Jamdani, designer three-pieces, kurtis, cosmetics, and accessories with nationwide home delivery.',
  keywords: 'Girlsgalary, saree, three piece, kurti, cosmetics, jewellery, bag, shoes, hijab, ladies shop bangladesh',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png'
  },
  openGraph: {
    title: 'Girlsgalary | Ladies Items Shop',
    description: 'Cash on delivery all over Bangladesh. Authentic Sarees, Three-Pieces, Kurtis, Cosmetics & Hijabs.',
    type: 'website',
    images: ['/images/logo.png']
  },
  verification: {
    other: {
      'facebook-domain-verification': 's3bis6anuoon3twj6vuz8ipxny10kk',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="h-full">
      <head>
        <meta name="facebook-domain-verification" content="s3bis6anuoon3twj6vuz8ipxny10kk" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-zinc-900 antialiased">
        <LanguageProvider>
          <CartProvider>
            <FacebookPixel />
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
