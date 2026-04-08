'use server';
/**
 * @fileOverview An AI chat agent that maintains conversation context.
 *
 * - contextAwareAiConversation - A function that handles context-aware AI chat.
 * - ContextAwareAiConversationInput - The input type for the contextAwareAiConversation function.
 * - ContextAwareAiConversationOutput - The return type for the contextAwareAiConversation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe('The role of the sender (user or model).'),
  content: z.string().describe('The content of the message.'),
});

const ContextAwareAiConversationInputSchema = z.object({
  messages: z.array(ChatMessageSchema).describe('An array of previous messages in the conversation, including the current user query. Each message has a role (user/model) and content.'),
});
export type ContextAwareAiConversationInput = z.infer<typeof ContextAwareAiConversationInputSchema>;

const ContextAwareAiConversationOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the conversation, maintaining context.'),
});
export type ContextAwareAiConversationOutput = z.infer<typeof ContextAwareAiConversationOutputSchema>;

export async function contextAwareAiConversation(input: ContextAwareAiConversationInput): Promise<ContextAwareAiConversationOutput> {
  return contextAwareAiConversationFlow(input);
}

const contextAwareAiConversationPrompt = ai.definePrompt({
  name: 'contextAwareAiConversationPrompt',
  input: { schema: ContextAwareAiConversationInputSchema },
  output: { schema: ContextAwareAiConversationOutputSchema },
  prompt: `You are MindFlow AI, a modern educational assistant that generates clean, beautiful, and well-structured HTML responses.

========================
🎯 OUTPUT RULES
========================
- Output ONLY valid HTML (NO markdown, NO <script>)
- Use semantic HTML like <div>, <p>, <h2>, <h3>, <ul>, <li>, <strong>
- Use inline styling for clean UI (soft colors, padding, spacing, rounded corners)
- Ensure the layout looks modern and readable (like a SaaS UI)

========================
🎨 DESIGN GUIDELINES
========================
- Use card-style containers with:
  - light background colors
  - padding (12px–20px)
  - border-radius (8px–12px)
  - margin between sections
- Use clear headings (not too many)
- Keep spacing balanced (not crowded)

========================
🧠 CONTENT STYLE
========================
- Explain clearly and simply (student-friendly)
- Use bullet points or numbered steps where needed
- Highlight important points using <strong>
- Avoid unnecessary repetition
- Keep response structured but NOT rigid

========================
🧮 MATH SUPPORT
========================
- Use KaTeX format:
  - Inline: \\( ... \\)
  - Block: \\[ ... \\]
- Always verify calculations step-by-step before final answer

========================
📊 DIAGRAMS
========================
- If needed, create diagrams using simple HTML/CSS
- Use boxes, borders, labels (no images)

========================
🚫 STRICT RULES
========================
- NO markdown
- NO <script>
- NO broken HTML
- DO NOT force fixed sections like "Overview", "Summary" unless needed

========================
💬 CONTEXT AWARENESS
========================
Use the full conversation history for context.

Conversation:
{{#each messages}}
{{this.role}}: {{{this.content}}}
{{/each}}

model:
`
});

const contextAwareAiConversationFlow = ai.defineFlow(
  {
    name: 'contextAwareAiConversationFlow',
    inputSchema: ContextAwareAiConversationInputSchema,
    outputSchema: ContextAwareAiConversationOutputSchema,
  },
  async (input) => {
    const { output } = await contextAwareAiConversationPrompt(input);
    if (!output) {
      throw new Error('AI did not return a response.');
    }
    return output;
  }
);
