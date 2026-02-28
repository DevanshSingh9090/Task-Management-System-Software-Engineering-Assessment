import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import BootstrapAuth from '@/components/BootstrapAuth';
import Navbar from '@/components/Navbar';

export const metadata = { title: 'Task Manager' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BootstrapAuth />
        <Toaster />
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}