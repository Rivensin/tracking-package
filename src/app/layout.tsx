import 'leaflet/dist/leaflet.css'
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Roboto, Mona_Sans } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import Navbar from './navbar';
import Script from 'next/script';
import Footer from './footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistRoboto = Roboto({
  variable : '--font-roboto',
  subsets : ['latin'],
  weight: ['100','200','300','500','600','700','800','900'],
})

const monaSans = Mona_Sans({
  variable : '--font-mona-sans',
  subsets : ['latin'],
  weight: ['200','300','500','600','700','800','900'],
})

export const viewport : Viewport = {
  width: 'device-width',
  initialScale: 1
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  title: 'Dlooti Tracking Delivery',
  description:'Dlooti Tracking for Delivery',
  authors: [{name:'riven', url:process.env.NEXT_PUBLIC_API_URL}],
  icons: {
    icon: '/icons/icon.png',
  },
  openGraph: {
    title: 'Dlooti',
    description: 'Dlooti Tracking for Delivery',
    images: [
      {
        url: 'icons/icon.png',
        width: 800,
        height: 600,
      }
    ],
    url: process.env.NEXT_PUBLIC_API_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLATFORM_API_KEY}&libraries=places`}
          strategy='afterInteractive'
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${geistRoboto.variable} ${monaSans.variable} min-h-screen flex flex-col bg-slate-50`}>
        <Navbar />
        <main className='flex-1'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
