
// layout.js or layout.tsx
import { Poppins } from 'next/font/google';
import './globals.css';
import NextAuthSessionProvider from '@/Providers/NextAuthSessionProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // choose the weights you need
  variable: '--font-poppins', // optional: for CSS variable usage
  display: 'swap',
});

export const metadata = {
  title: "Home | IC",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <NextAuthSessionProvider>
         <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
      </NextAuthSessionProvider>
     
    </html>
  );
}
