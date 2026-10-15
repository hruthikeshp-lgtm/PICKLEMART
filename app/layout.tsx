import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Pickle Mart | Feel the real taste, made by Grandma',
  description:
    'Order authentic Indian traditional vegetarian and non-vegetarian pickles online. 43 varieties including Mango Avakaya, Chicken, Mutton, Fish, Prawn, and Gongura pickles made with pure cold-pressed oils.',
  keywords: [
    'Indian Pickles',
    'Pickle Mart',
    'Mango Avakaya',
    'Chicken Pickle',
    'Mutton Pickle',
    'Fish Pickle',
    'Prawn Pickle',
    'Gongura Pickle',
    'Homemade Pickles',
    'Andhra Pickles',
  ],
  openGraph: {
    title: 'Pickle Mart | Authentic Homemade Indian Pickles',
    description: 'Traditional taste, homemade goodness. Explore our 43 varieties of traditional pickles.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-pickle-warmWhite text-pickle-darkText antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
