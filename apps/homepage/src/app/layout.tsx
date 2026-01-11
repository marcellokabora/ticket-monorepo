import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'ticketapp - Homepage',
    description: 'Welcome to ticketapp - Your premium airport experience',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
