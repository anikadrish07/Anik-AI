
'use server';
/**
 * @fileOverview An AI chat agent that maintains conversation context and provides structured reports.
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
  messages: z.array(ChatMessageSchema).describe('An array of previous messages in the conversation.'),
});
export type ContextAwareAiConversationInput = z.infer<typeof ContextAwareAiConversationInputSchema>;

const ContextAwareAiConversationOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the conversation, formatted as structured HTML.'),
});
export type ContextAwareAiConversationOutput = z.infer<typeof ContextAwareAiConversationOutputSchema>;

export async function contextAwareAiConversation(input: ContextAwareAiConversationInput): Promise<ContextAwareAiConversationOutput> {
  return contextAwareAiConversationFlow(input);
}

const contextAwareAiConversationPrompt = ai.definePrompt({
  name: 'contextAwareAiConversationPrompt',
  input: { schema: ContextAwareAiConversationInputSchema },
  output: { schema: ContextAwareAiConversationOutputSchema },
  prompt: `You are MindFlow AI, a sophisticated educational and technical consultant. 
You must provide detailed, structured responses using ONLY valid HTML.

========================
📜 RESPONSE STRUCTURE
========================
Every response MUST follow this exact structure:

1. <section><h2>Detailed Overview</h2><p>...</p></section>
   A comprehensive explanation of the concept or answer to the query.

2. <section><h2>Functionality & Insights</h2><ul><li>...</li></ul></section>
   A breakdown of how things work, key features, or technical insights.

3. <section><h2>Response Summary</h2><p><strong>...</strong></p></section>
   A brief, high-level wrap-up of the interaction.

========================
🎨 DESIGN RULES
========================
- Use <h2> for section titles.
- Use <p> for body text.
- Use <ul> and <li> for lists.
- Use <strong> for emphasis.
- Use inline CSS for clean padding: style="padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 15px;"
- Output ONLY valid HTML. NO Markdown.

========================
💬 CONTEXT
========================
Use the conversation history to stay relevant.

Conversation History:
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
    try {
      const { output } = await contextAwareAiConversationPrompt(input);
      if (!output) {
        throw new Error('AI did not return a response.');
      }
      return output;
    } catch (error: any) {
      console.error("Genkit Flow Error:", error);
      if (error.message.includes("secure TLS connection")) {
        return { response: "<div style='color: #ff4444; padding: 20px;'><strong>Network Error:</strong> The connection to the AI service was interrupted. Please check your internet connection or API key settings.</div>" };
      }
      throw error;
    }
  }
);
