import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StatusBanner } from "./StatusBanner";
import { SplashScreen } from "./SplashScreen";
import { Providers } from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sri Devi Sugarcane Shop",
  description: "Fresh, Natural & Refreshing Sugarcane Juice and Arun Ice Creams",
  keywords: ["sugarcane juice", "ice cream", "fresh juice", "arun ice creams", "local shop"],
  openGraph: {
    title: "Sri Devi Sugarcane Shop",
    description: "Fresh, Natural & Refreshing Sugarcane Juice and Arun Ice Creams",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport = {
  themeColor: "#4f805d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <SplashScreen />
          <StatusBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
