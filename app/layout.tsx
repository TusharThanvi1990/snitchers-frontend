import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
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
      <body>
        <ChatProvider>
          <div className="main-container">
            <Navbar />
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
