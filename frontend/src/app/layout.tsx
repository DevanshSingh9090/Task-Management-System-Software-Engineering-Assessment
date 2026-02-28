import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import BootstrapAuth from '@/components/BootstrapAuth';
import Navbar from '@/components/Navbar';
import ThemeInit from '@/components/ThemeInit';

export const metadata = {
  title: 'TaskFlow — Task Manager',
  description: 'A modern task management app with secure authentication',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeInit />
        <BootstrapAuth />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {children}
        </main>
      </body>
    </html>
  );
}