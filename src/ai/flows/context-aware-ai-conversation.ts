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
  prompt: `You are a helpful and coherent AI assistant. You maintain context throughout the conversation and respond to the latest user query based on the entire dialogue history.

Here is the conversation history:
{{#each messages}}
{{this.role}}: {{{this.content}}}
{{/each}}
model: `,
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
