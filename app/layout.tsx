import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Header from "@/components/Landing/Header"
import { ChatProvider } from "@/context/ChatContext";
import ChatWidgetWrapper from "@/components/Chat/ChatWidgetWrapper";

export const metadata: Metadata = {
  title: "Snitchers | Anonymous College Confessions",
  description: "Share your secrets, find your spark. The anonymous confession app for colleges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ChatProvider>
          <div className="main-container">
            <Header />
            {/* <Navbar /> */}
            <main className="content-wrapper">
              {children}
            </main>
            <ChatWidgetWrapper />
          </div>
        </ChatProvider>
      </body>
    </html>
  );
}
