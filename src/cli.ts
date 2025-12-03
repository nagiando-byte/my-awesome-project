#!/usr/bin/env node
/**
 * Zoom文字起こしCLI
 * コマンドラインから簡単に使用できるインターフェース
 */

import { ZoomTranscriber } from './transcriber.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// 環境変数の読み込み
dotenv.config();

interface CliOptions {
  input?: string;
  output?: string;
  language?: string;
  batch?: boolean;
  watch?: string;
}

/**
 * コマンドライン引数のパース
 */
function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-i':
      case '--input':
        options.input = args[++i];
        break;
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
      case '-l':
      case '--language':
        options.language = args[++i];
        break;
      case '-b':
      case '--batch':
        options.batch = true;
        break;
      case '-w':
      case '--watch':
        options.watch = args[++i];
        break;
      case '-h':
      case '--help':
        printHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

/**
 * ヘルプメッセージの表示
 */
function printHelp(): void {
  console.log(`
🎤 Zoom録画 自動文字起こしツール

使い方:
  npm run transcribe -- [オプション]

オプション:
  -i, --input <path>      入力動画ファイルのパス (必須)
  -o, --output <path>     出力テキストファイルのパス (任意)
  -l, --language <code>   言語コード (例: ja, en) デフォルト: ja
  -b, --batch             バッチモード（ディレクトリ内の全ファイルを処理）
  -w, --watch <dir>       ディレクトリを監視して自動処理
  -h, --help              このヘルプを表示

例:
  # 単一ファイルの文字起こし
  npm run transcribe -- -i ./zoom_recording.mp4

  # 言語を指定
  npm run transcribe -- -i ./recording.mp4 -l en

  # 出力先を指定
  npm run transcribe -- -i ./recording.mp4 -o ./transcripts/output.json

  # バッチ処理
  npm run transcribe -- -i ./recordings -b

環境変数:
  OPENAI_API_KEY          OpenAI APIキー (必須)

セットアップ:
  1. .envファイルを作成
  2. OPENAI_API_KEY=your-api-key を追加
  3. npm run transcribe を実行
`);
}

/**
 * ディレクトリ内の動画ファイルを取得
 */
function getVideoFiles(dirPath: string): string[] {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const files = fs.readdirSync(dirPath);

  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return videoExtensions.includes(ext);
    })
    .map((file) => path.join(dirPath, file));
}

/**
 * ディレクトリの監視と自動処理
 */
async function watchDirectory(
  dirPath: string,
  transcriber: ZoomTranscriber
): Promise<void> {
  console.log(`👀 ディレクトリを監視中: ${dirPath}`);
  console.log('新しい動画ファイルが追加されたら自動的に文字起こしを実行します');
  console.log('終了するには Ctrl+C を押してください\n');

  const processedFiles = new Set<string>();

  // 既存ファイルを処理済みとしてマーク
  const existingFiles = getVideoFiles(dirPath);
  existingFiles.forEach((file) => processedFiles.add(file));

  // ファイルシステムの監視
  fs.watch(dirPath, async (eventType, filename) => {
    if (!filename) return;

    const filePath = path.join(dirPath, filename);
    const ext = path.extname(filename).toLowerCase();
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

    if (videoExtensions.includes(ext) && !processedFiles.has(filePath)) {
      // ファイルが完全にコピーされるまで少し待つ
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (fs.existsSync(filePath) && !processedFiles.has(filePath)) {
        processedFiles.add(filePath);
        console.log(`\n📹 新しいファイルを検出: ${filename}`);

        try {
          await transcriber.transcribe({ inputPath: filePath });
        } catch (error) {
          console.error('❌ 処理エラー:', error);
        }
      }
    }
  });

  // プロセスを維持
  await new Promise(() => {});
}

/**
 * メイン処理
 */
async function main() {
  console.log('🌸 Zoom録画 自動文字起こしツール\n');

  const options = parseArgs();

  // API キーの確認
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ エラー: OPENAI_API_KEY が設定されていません');
    console.error('   .envファイルに OPENAI_API_KEY=your-api-key を追加してください\n');
    process.exit(1);
  }

  const transcriber = new ZoomTranscriber();

  // 監視モード
  if (options.watch) {
    if (!fs.existsSync(options.watch)) {
      console.error(`❌ エラー: ディレクトリが見つかりません: ${options.watch}`);
      process.exit(1);
    }
    await watchDirectory(options.watch, transcriber);
    return;
  }

  // 入力チェック
  if (!options.input) {
    console.error('❌ エラー: 入力ファイルを指定してください (-i オプション)');
    console.error('   詳細は --help を参照してください\n');
    process.exit(1);
  }

  try {
    // バッチモード
    if (options.batch) {
      if (!fs.existsSync(options.input)) {
        throw new Error(`ディレクトリが見つかりません: ${options.input}`);
      }

      const videoFiles = getVideoFiles(options.input);

      if (videoFiles.length === 0) {
        console.log('📁 動画ファイルが見つかりませんでした');
        return;
      }

      await transcriber.transcribeBatch(videoFiles, {
        language: options.language,
      });
    }
    // 単一ファイルモード
    else {
      await transcriber.transcribe({
        inputPath: options.input,
        outputPath: options.output,
        language: options.language,
      });
    }

    console.log('\n✨ すべての処理が完了しました！');
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// エントリーポイント
main().catch((error) => {
  console.error('予期しないエラー:', error);
  process.exit(1);
});

