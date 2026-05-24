// generate.js
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('--- AtCoder TSファイル自動生成ツール ---');

  const id = await new Promise(r => rl.question('問題IDを入力してください (例: abc350_a): ', r));
  if (!id) {
    console.error('問題IDは必須です。');
    rl.close();
    return;
  }

  const title = await new Promise(r => rl.question('問題のタイトルを入力してください (例: ABC350 - A問題): ', r));

  console.log('\n--- テストケースの入力 ---');
  console.log('※ 入力も出力も、貼り付けた後に「END」と入力してEnterを押してね。');
  console.log('※ 完全に終了する時は、新しいケースの[入力]で何も書かずに「END」と打ってね。');

  const testCases = [];
  let caseNum = 1;

  // 状態管理フラグ: 'INPUT' (入力待ち) | 'EXPECTED' (出力待ち)
  let mode = 'INPUT';
  let currentInputLines = [];
  let currentExpectedLines = [];

  console.log(`\n[ケース ${caseNum}]`);
  console.log('▼ 入力を貼り付けてね（最後に「END」＋Enter）:');

  rl.on('line', (line) => {
    const trimmed = line.trim();

    if (mode === 'INPUT') {
      if (trimmed === 'END') {
        if (currentInputLines.length === 0) {
          // 何も入力せずにENDが来たら、すべての入力を終了してファイル書き出し
          finishAndWrite(id, title, testCases);
          return;
        }
        // 入力フェーズ終了 ➔ 出力フェーズへ
        mode = 'EXPECTED';
        console.log('▼ 期待される出力を貼り付けてね（最後に「END」＋Enter）:');
        return;
      }
      // 💡 マスターの言う通り、本当のデータに合わせて各行をそのまま蓄積
      currentInputLines.push(line);

    } else if (mode === 'EXPECTED') {
      if (trimmed === 'END') {
        // 💡 入力も出力も、公式ルールに合わせて末尾に必ず改行コード（\n）を付与！
        const input = currentInputLines.join('\\n') + '\\n';
        const expected = currentExpectedLines.join('\\n') + '\\n'; // 💡 ここを修正！

        testCases.push({ input, expected });

        // 次のケースの準備
        caseNum++;
        mode = 'INPUT';
        currentInputLines = [];
        currentExpectedLines = [];

        console.log(`\n[ケース ${caseNum}]`);
        console.log('▼ 入力を貼り付けてね（最後に「END」＋Enter。終わるなら「END」だけ入力）:');
        return;
      }
      // 出力行を蓄積
      currentExpectedLines.push(line);
    }
  });
}

function finishAndWrite(id, title, testCases) {
  const template = `// src/atcoder/${id}.ts
export const title = "${title || id.toUpperCase()}";
export const testCases = [
${testCases.map(tc => `  { input: "${tc.input}", expected: "${tc.expected}" },`).join('\n')}
];

export function solve(input: string): string {
  // ここにロジックを記述
  const lines = input.trim().split('\\n');
  
  return "";
}
`;

  const targetPath = path.join('src', 'atcoder', `${id}.ts`);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, template, 'utf8');

  console.log(`\n🎉 正常にファイルを生成しました: ${targetPath}`);
  rl.close();
}

main();
