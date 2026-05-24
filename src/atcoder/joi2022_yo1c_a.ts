// src/atcoder/joi2022_yo1c_a.ts
export const title = "JOI 2021/2022 一次予選 (第3回) 過去問A";
export const testCases = [
  { input: "150\n155\n", expected: "5\n" },
  { input: "100\n101\n", expected: "1\n" },
  { input: "100\n200\n", expected: "100\n" },
];

export function solve(input: string): string {
  // ここにロジックを書くよ
  const [a, b] = input.trim().split('\n').map(Number);
  return String(b - a) + '\n';
}
