'use server';
/**
 * @fileOverview A Genkit flow for generating AI chat responses.
 *
 * - aiChatResponse - A function that handles generating an AI chat response.
 * - AIChatResponseInput - The input type for the aiChatResponse function.
 * - AIChatResponseOutput - The return type for the aiChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input schema for the AI chat response flow.
 */
const AIChatResponseInputSchema = z.object({
  message: z.string().describe('The user\'s chat message.'),
});
export type AIChatResponseInput = z.infer<typeof AIChatResponseInputSchema>;

/**
 * Defines the output schema for the AI chat response flow.
 */
const AIChatResponseOutputSchema = z.object({
  response: z.string().describe('The AI\'s generative response.'),
});
export type AIChatResponseOutput = z.infer<typeof AIChatResponseOutputSchema>;

/**
 * Defines a prompt for generating AI chat responses. It instructs the AI to be a helpful assistant.
 */
const aiChatResponsePrompt = ai.definePrompt({
  name: 'aiChatResponsePrompt',
  input: {schema: AIChatResponseInputSchema},
  output: {schema: AIChatResponseOutputSchema},
  prompt: `You are a helpful and direct AI assistant. Provide a relevant and coherent response to the user's message.

User message: {{{message}}} `,
});

/**
 * Defines the Genkit flow for generating AI chat responses.
 * It takes a user's message as input and returns an AI-generated response.
 */
const aiChatResponseFlow = ai.defineFlow(
  {
    name: 'aiChatResponseFlow',
    inputSchema: AIChatResponseInputSchema,
    outputSchema: AIChatResponseOutputSchema,
  },
  async (input) => {
    const {output} = await aiChatResponsePrompt(input);
    return output!;
  }
);

/**
 * Wrapper function to call the AI chat response Genkit flow.
 * @param input The user's chat message.
 * @returns A promise that resolves to the AI's generative response.
 */
export async function aiChatResponse(
  input: AIChatResponseInput
): Promise<AIChatResponseOutput> {
  return aiChatResponseFlow(input);
}
