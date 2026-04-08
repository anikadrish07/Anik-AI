"use client"

import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import DOMPurify from "dompurify"
import { useEffect, useRef } from "react"
import renderMathInElement from "katex/contrib/auto-render"

interface MessageBubbleProps {
  role: "user" | "model"
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user"
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && !isUser) {
      renderMathInElement(contentRef.current, {
        delimiters: [
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      })
    }
  }, [content, isUser])

  return (
    <div className={cn(
      "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[85%] md:max-w-[75%] gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>

        <Avatar className={cn(
          "h-8 w-8 mt-1 border",
          isUser ? "border-primary/20" : "border-accent/20"
        )}>
          <AvatarFallback className={isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-accent"
          }>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed break-words",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-secondary text-foreground rounded-tl-none border border-border"
          )}
        >
          {isUser ? (
            <p>{content}</p>
          ) : (
            <div
              ref={contentRef}
              className="[&_section]:mb-4 [&_h2]:text-base [&_h2]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}