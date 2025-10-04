// Unit conversions will be handled in this file.

'use server';

/**
 * @fileOverview Converts between different units (e.g., currency, length, weight).
 *
 * - convertUnits - A function that handles the unit conversion process.
 * - ConvertUnitsInput - The input type for the convertUnits function.
 * - ConvertUnitsOutput - The return type for the convertUnits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertUnitsInputSchema = z.object({
  value: z.number().describe('The numerical value to convert.'),
  fromUnit: z.string().describe('The unit to convert from (e.g., USD, meters, kg).'),
  toUnit: z.string().describe('The unit to convert to (e.g., EUR, feet, lbs).'),
});
export type ConvertUnitsInput = z.infer<typeof ConvertUnitsInputSchema>;

const ConvertUnitsOutputSchema = z.object({
  convertedValue: z.number().describe('The converted numerical value.'),
  explanation: z.string().describe('An explanation of the conversion performed, including any exchange rates used.'),
});
export type ConvertUnitsOutput = z.infer<typeof ConvertUnitsOutputSchema>;

export async function convertUnits(input: ConvertUnitsInput): Promise<ConvertUnitsOutput> {
  return convertUnitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertUnitsPrompt',
  input: {schema: ConvertUnitsInputSchema},
  output: {schema: ConvertUnitsOutputSchema},
  prompt: `You are a unit conversion expert. You will be provided with a value, a starting unit, and a target unit.
Your task is to convert the value from the starting unit to the target unit.

Value: {{{value}}}
From Unit: {{{fromUnit}}}
To Unit: {{{toUnit}}}

Return the converted value, and include a detailed explanation of the conversion process, including any exchange rates used, and the source of the exchange rates.
Ensure the converted value is a number.

Example:
Value: 10
From Unit: USD
To Unit: EUR

Output:
{
  "convertedValue": 9.20,
  "explanation": "Converted 10 USD to 9.20 EUR using an exchange rate of 1 USD = 0.92 EUR. Exchange rate obtained from a reliable financial data source on October 26, 2023."
}
`,
});

const convertUnitsFlow = ai.defineFlow(
  {
    name: 'convertUnitsFlow',
    inputSchema: ConvertUnitsInputSchema,
    outputSchema: ConvertUnitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
