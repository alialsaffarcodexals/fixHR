import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise Payroll',
  description: 'HR & Payroll management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex">
          {/* Left nav would be your sidebar */}
          <main className="w-full p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
