"use client"

import { Bot } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TypingIndicator() {
  return (
    <div className="flex w-full mb-6 justify-start animate-in fade-in duration-300">
      <div className="flex gap-3 flex-row">
        <Avatar className="h-8 w-8 mt-1 border border-accent/20">
          <AvatarFallback className="bg-secondary text-accent">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="px-4 py-3 rounded-2xl bg-secondary text-foreground rounded-tl-none border border-border flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}