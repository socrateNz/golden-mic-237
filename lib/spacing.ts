/**
 * Tailwind-like spacing scale in pixels.
 * Example: s(4) -> "16px", s(24) -> "96px"
 */
export function s(step: number): string {
  return `${step * 4}px`;
}

