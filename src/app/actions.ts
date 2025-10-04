'use server';

import { convertUnits, ConvertUnitsInput } from '@/ai/flows/unit-conversion';

export async function handleUnitConversion(input: ConvertUnitsInput) {
  try {
    const result = await convertUnits(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Unit conversion failed:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `AI conversion failed: ${errorMessage}` };
  }
}
