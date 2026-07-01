import { normalizeInput } from "./normalizeInput";

export function validateAnswer(input: string, expected: string): boolean {
  return normalizeInput(input) === normalizeInput(expected);
}
