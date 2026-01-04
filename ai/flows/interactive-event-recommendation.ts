'use server';

/**
 * @fileOverview An interactive event recommendation AI agent.
 *
 * - interactiveEventRecommendation - A function that handles the event recommendation process.
 * - InteractiveEventRecommendationInput - The input type for the interactiveEventRecommendation function.
 * - InteractiveEventRecommendationOutput - The return type for the interactiveEventRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { v4 as uuidv4 } from 'uuid';

const InteractiveEventRecommendationInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma separated list of interests of the user.'),
  location: z.string().describe('The location of the user.'),
  date: z.string().describe('The date for which to find events.'),
});
export type InteractiveEventRecommendationInput =
  z.infer<typeof InteractiveEventRecommendationInputSchema>;

const InteractiveEventRecommendationOutputSchema = z.object({
  eventRecommendations: z.array(
    z.object({
      id: z.string().describe('A unique identifier for the event.'),
      name: z.string().describe('The name of the event.'),
      venue: z.string().describe('The venue of the event.'),
      description: z.string().describe('A short description of the event.'),
    })
  ),
});
export type InteractiveEventRecommendationOutput =
  z.infer<typeof InteractiveEventRecommendationOutputSchema>;

export async function interactiveEventRecommendation(
  input: InteractiveEventRecommendationInput
): Promise<InteractiveEventRecommendationOutput> {
  const result = await interactiveEventRecommendationFlow(input);
  // Add unique IDs to the recommendations
  result.eventRecommendations = result.eventRecommendations.map(event => ({
    ...event,
    id: event.id || uuidv4(),
  }));
  return result;
}

const prompt = ai.definePrompt({
  name: 'interactiveEventRecommendationPrompt',
  input: {schema: InteractiveEventRecommendationInputSchema},
  output: {schema: InteractiveEventRecommendationOutputSchema},
  prompt: `You are an event recommendation expert. Given the user's interests, location and date, you will recommend events. Generate a unique id for each event.

Interests: {{{interests}}}
Location: {{{location}}}
Date: {{{date}}}

Recommend events in the following format:

\`\`\`
{
  "eventRecommendations": [
    {
      "id": "event-12345",
      "name": "Event Name",
      "venue": "Venue Name",
      "description": "A short description of the event."
    }
  ]
}
\`\`\`
`,
});

const interactiveEventRecommendationFlow = ai.defineFlow(
  {
    name: 'interactiveEventRecommendationFlow',
    inputSchema: InteractiveEventRecommendationInputSchema,
    outputSchema: InteractiveEventRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
