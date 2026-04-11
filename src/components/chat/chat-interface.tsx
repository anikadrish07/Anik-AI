
"use client"

import * as React from "react"
import { Send, Trash2, Plus, LogOut, Settings, MessageSquare, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { contextAwareAiConversation } from "@/ai/flows/context-aware-ai-conversation"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"

type ChatMessage = {
  role: "user" | "model"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [chatId, setChatId] = React.useState<number | null>(null);
  const [chatList, setChatList] = React.useState<any[]>([]);
  const { toast } = useToast()
  const router = useRouter()

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = { role: "user", content: inputValue.trim() }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInputValue("")
    setIsLoading(true)

    try {
      let currentChatId = chatId;

      // Create chat if not exists
      if (!currentChatId) {
        const res = await fetch("/api/chat/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: inputValue.slice(0, 30),
          }),
        });

        const data = await res.json();
        currentChatId = data.id;
        setChatId(currentChatId);

        await fetchChats();
      }

      //Save USER message
      await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: currentChatId,
          role: "user",
          content: inputValue,
        }),
      });

      // Call AI
      const response = await contextAwareAiConversation({
        messages: updatedMessages
      });

      if (response?.response) {
        // Save AI message
        await fetch("/api/chat/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: currentChatId,
            role: "model",
            content: response.response,
          }),
        });

        setMessages(prev => [
          ...prev,
          { role: "model", content: response.response }
        ]);

      } else {
        throw new Error("Empty response from AI");
      }

    } catch (error: any) {
      console.error("AI Chat Error:", error)
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message || "Failed to reach MindFlux servers.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const fetchChats = async () => {
    const res = await fetch("/api/chat/list");
    const data = await res.json();
    setChatList(data);
  };
  React.useEffect(() => {
    fetchChats();
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    toast({
      title: "Conversation Reset",
      description: "Starting a fresh session.",
    })
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "Failed to sign out safely.",
      })
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar className="border-r border-border bg-sidebar-background">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">MindFlux AI</span>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-secondary/50 border-border hover:bg-secondary"
              onClick={clearChat}
            >
              <Plus className="h-4 w-4" />
              New Conversation
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chatList.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        onClick={async () => {
                          setChatId(chat.id);

                          const res = await fetch(`/api/chat/messages?chatId=${chat.id}`);
                          const data = await res.json();

                          setMessages(data);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{chat.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 relative h-full">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background/50 backdrop-blur px-6 sticky top-0 z-10">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-muted-foreground">Active Session</h2>
            </div>

          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 scroll-smooth"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-700">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome to MindFlux</h1>
                <p className="text-muted-foreground">
                  Your sophisticated AI assistant for deep thinking, creative writing, and complex problem-solving.
                </p>
                {/* <div className="mt-8 grid grid-cols-1 gap-3 w-full">
                  <Button variant="secondary" className="justify-start h-auto py-3 px-4 border border-border" onClick={() => {
                    setInputValue("Explain the concept of neural networks.");
                  }}>
                    "Explain neural networks..."
                  </Button>
                  <Button variant="secondary" className="justify-start h-auto py-3 px-4 border border-border" onClick={() => {
                    setInputValue("Brainstorm marketing strategies for a SaaS product.");
                  }}>
                    "Brainstorm SaaS marketing..."
                  </Button>
                </div> */}
              </div>
            ) : (
              messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role} content={msg.content} />
              ))
            )}
            {isLoading && <TypingIndicator />}
          </div>

          <div className="p-4 md:p-6 bg-background border-t border-border">
            <form
              onSubmit={handleSendMessage}
              className="max-w-4xl mx-auto"
            >
              <div className="relative">

                <Textarea
                  placeholder="Message MindFlow..."
                  className="min-h-[56px] w-full bg-secondary/30 border-border resize-none pt-[14px] pb-[14px] pr-16 pl-4 rounded-xl focus:ring-primary/50 focus:border-primary/50 transition-all text-base leading-relaxed"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <Button
                  size="icon"
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-9 w-9 rounded-lg",
                    inputValue.trim()
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>

              </div>

              <p className="text-[10px] text-center text-muted-foreground mt-3 opacity-50">
                MindFlux can make mistakes. Check important info.
              </p>
            </form>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
