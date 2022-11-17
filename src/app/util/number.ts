export function ensureNumberInRange(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function getPercent(num: number, min: number, max: number): number {
  return (num - min) / (max - min) * 100;
}
