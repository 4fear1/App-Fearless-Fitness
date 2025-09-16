'use server';

/**
 * @fileOverview Generates a personalized workout plan based on user input.
 *
 * - generatePersonalizedWorkoutPlan - A function that generates a personalized workout plan.
 * - GeneratePersonalizedWorkoutPlanInput - The input type for the generatePersonalizedWorkoutPlan function.
 * - GeneratePersonalizedWorkoutPlanOutput - The return type for the generatePersonalizedWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedWorkoutPlanInputSchema = z.object({
  fitnessLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The user fitness level.'),
  goals: z.string().describe('The user fitness goals.'),
  equipment: z.string().describe('The available equipment.'),
});
export type GeneratePersonalizedWorkoutPlanInput = z.infer<
  typeof GeneratePersonalizedWorkoutPlanInputSchema
>;

const GeneratePersonalizedWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The generated workout plan.'),
});
export type GeneratePersonalizedWorkoutPlanOutput = z.infer<
  typeof GeneratePersonalizedWorkoutPlanOutputSchema
>;

export async function generatePersonalizedWorkoutPlan(
  input: GeneratePersonalizedWorkoutPlanInput
): Promise<GeneratePersonalizedWorkoutPlanOutput> {
  return generatePersonalizedWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedWorkoutPlanPrompt',
  input: {schema: GeneratePersonalizedWorkoutPlanInputSchema},
  output: {schema: GeneratePersonalizedWorkoutPlanOutputSchema},
  prompt: `Você é um personal trainer. Gere um plano de treino com base no nível de condicionamento físico, objetivos e equipamentos disponíveis do usuário. Formate cada exercício com o nome do exercício em uma linha e os detalhes (Séries, Repetições, Descanso) na linha seguinte, separados por nova linha dupla.

Nível de Fitness: {{{fitnessLevel}}}
Objetivos: {{{goals}}}
Equipamento: {{{equipment}}}

Plano de Treino:`,
});

const generatePersonalizedWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedWorkoutPlanFlow',
    inputSchema: GeneratePersonalizedWorkoutPlanInputSchema,
    outputSchema: GeneratePersonalizedWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
