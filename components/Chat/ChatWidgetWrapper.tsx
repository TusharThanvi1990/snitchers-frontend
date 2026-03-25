"use client";

import { useChat } from "@/context/ChatContext";
import ChatWidget from "./ChatWidget";

export default function ChatWidgetWrapper() {
  const { user } = useChat();
  if (!user) return null;
  return <ChatWidget user={user} />;
}
