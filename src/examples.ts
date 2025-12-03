/**
 * Zoom文字起こしツール - 使用例
 * 
 * このファイルは、プログラムから直接ツールを使う方法を示しています。
 */

import { ZoomTranscriber } from './transcriber.js';
import * as dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

/**
 * 例1: 基本的な使い方
 */
async function example1_basic() {
  console.log('=== 例1: 基本的な文字起こし ===\n');

  const transcriber = new ZoomTranscriber();

  try {
    const result = await transcriber.transcribe({
      inputPath: './sample_recording.mp4',
      // outputPath: './output/transcript.json', // 省略可能
      language: 'ja', // 日本語
    });

    console.log('✅ 成功!');
    console.log(`📄 出力ファイル: ${result.outputPath}`);
    console.log(`⏱️  処理時間: ${result.processingTime.toFixed(2)}秒`);
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

/**
 * 例2: バッチ処理
 */
async function example2_batch() {
  console.log('\n=== 例2: 複数ファイルの一括処理 ===\n');

  const transcriber = new ZoomTranscriber();

  const files = [
    './recordings/meeting1.mp4',
    './recordings/meeting2.mp4',
    './recordings/meeting3.mp4',
  ];

  try {
    const results = await transcriber.transcribeBatch(files, {
      language: 'ja',
    });

    console.log(`\n✅ ${results.length}件のファイルを処理しました`);
    results.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.outputPath}`);
    });
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

/**
 * 例3: エラーハンドリング付き
 */
async function example3_errorHandling() {
  console.log('\n=== 例3: エラーハンドリング ===\n');

  const transcriber = new ZoomTranscriber();

  const files = [
    './recordings/valid.mp4',
    './recordings/invalid.mp4', // 存在しないファイル
    './recordings/another.mp4',
  ];

  const successfulResults = [];
  const failedFiles = [];

  for (const file of files) {
    try {
      console.log(`処理中: ${file}`);
      const result = await transcriber.transcribe({ inputPath: file });
      successfulResults.push(result);
      console.log(`✅ 成功: ${file}`);
    } catch (error) {
      failedFiles.push({ file, error });
      console.error(`❌ 失敗: ${file}`, error instanceof Error ? error.message : error);
    }
  }

  console.log(`\n📊 結果:`);
  console.log(`  成功: ${successfulResults.length}件`);
  console.log(`  失敗: ${failedFiles.length}件`);
}

/**
 * 例4: 英語の文字起こし
 */
async function example4_english() {
  console.log('\n=== 例4: 英語の文字起こし ===\n');

  const transcriber = new ZoomTranscriber();

  try {
    const result = await transcriber.transcribe({
      inputPath: './english_meeting.mp4',
      language: 'en', // 英語を指定
    });

    console.log('✅ English transcription completed!');
    console.log(`📄 Output: ${result.outputPath}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * 例5: カスタム出力パス
 */
async function example5_customOutput() {
  console.log('\n=== 例5: カスタム出力パス ===\n');

  const transcriber = new ZoomTranscriber();

  try {
    const result = await transcriber.transcribe({
      inputPath: './recording.mp4',
      outputPath: './transcripts/2024-12-03_meeting.json',
      language: 'ja',
    });

    console.log('✅ 指定した場所に保存されました');
    console.log(`📄 ${result.outputPath}`);
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

/**
 * メイン関数 - すべての例を実行
 */
async function main() {
  console.log('🎤 Zoom文字起こしツール - 使用例\n');

  // 実行したい例のコメントを外してください

  // await example1_basic();
  // await example2_batch();
  // await example3_errorHandling();
  // await example4_english();
  // await example5_customOutput();

  console.log('\n✨ 全ての例を確認しました!');
  console.log('実際に使うには、上記の関数のコメントを外してください。');
}

// スクリプトとして実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('予期しないエラー:', error);
    process.exit(1);
  });
}

// 他のモジュールからインポートできるようにエクスポート
export {
  example1_basic,
  example2_batch,
  example3_errorHandling,
  example4_english,
  example5_customOutput,
};

