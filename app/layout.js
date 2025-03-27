import AuthProvider from "./components/SessionProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientChatWrapper from "./components/ClientChatWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Holidays",
  description: "Bokk your holiday packages and enjoy your holidays",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <ClientChatWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
