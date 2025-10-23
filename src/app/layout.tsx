import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "exercise-tracker",
  description: "A web application for tracking exercises and workouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* globalne defs z gradientem — dostępne na wszystkich stronach */}
        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="loginGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#590d22" />
              <stop offset="10%" stopColor="#800f2f" />
              <stop offset="20%" stopColor="#a4133c" />
              <stop offset="30%" stopColor="#c9184a" />
              <stop offset="45%" stopColor="#ff4d6d" />
              <stop offset="60%" stopColor="#ff758f" />
              <stop offset="75%" stopColor="#ff8fa3" />
              <stop offset="85%" stopColor="#ffb3c1" />
              <stop offset="95%" stopColor="#ffccd5" />
              <stop offset="100%" stopColor="#fff0f3" />
            </linearGradient>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
