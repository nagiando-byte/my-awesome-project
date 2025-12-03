# Zoom録画 自動文字起こしツール 🎤

Zoom録画ファイルを自動的に文字起こしするツールです。OpenAI Whisper APIを使用して高精度な文字起こしを実現します。

## 機能

✅ **自動音声抽出**: 動画ファイルから音声を自動抽出
✅ **高精度文字起こし**: OpenAI Whisper APIによる高品質な文字起こし
✅ **バッチ処理**: 複数ファイルの一括処理に対応
✅ **監視モード**: ディレクトリを監視して新しいファイルを自動処理
✅ **多言語対応**: 日本語・英語など複数言語に対応
✅ **タイムスタンプ付き**: セグメント単位のタイムスタンプ情報

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. FFmpegのインストール

このツールは音声抽出にFFmpegを使用します。

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
[FFmpeg公式サイト](https://ffmpeg.org/download.html)からダウンロードしてインストール

### 3. OpenAI APIキーの設定

1. [OpenAI Platform](https://platform.openai.com/api-keys)でAPIキーを取得
2. `.env`ファイルを作成:

```bash
cp .env.example .env
```

3. `.env`ファイルを編集してAPIキーを設定:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

## 使い方

### 基本的な使い方

単一ファイルの文字起こし:

```bash
npm run transcribe -- -i ./path/to/zoom_recording.mp4
```

### オプション

```bash
# 出力先を指定
npm run transcribe -- -i ./recording.mp4 -o ./output/transcript.json

# 言語を指定（英語）
npm run transcribe -- -i ./recording.mp4 -l en

# バッチ処理（ディレクトリ内の全動画ファイル）
npm run transcribe -- -i ./recordings -b

# ディレクトリを監視して自動処理
npm run transcribe -- -w ./recordings
```

### コマンドラインオプション

| オプション | 短縮形 | 説明 | 必須 |
|----------|-------|------|------|
| `--input` | `-i` | 入力動画ファイルまたはディレクトリのパス | ✅ |
| `--output` | `-o` | 出力ファイルのパス | ❌ |
| `--language` | `-l` | 言語コード（ja, en など） | ❌ |
| `--batch` | `-b` | バッチモード（ディレクトリ内の全ファイルを処理） | ❌ |
| `--watch` | `-w` | ディレクトリを監視して自動処理 | ❌ |
| `--help` | `-h` | ヘルプを表示 | ❌ |

## プログラムでの使用

TypeScript/JavaScriptコードから直接使用することもできます:

```typescript
import { ZoomTranscriber } from './src/transcriber.js';

const transcriber = new ZoomTranscriber();

// 単一ファイルの文字起こし
const result = await transcriber.transcribe({
  inputPath: './zoom_recording.mp4',
  outputPath: './transcript.json',
  language: 'ja',
});

console.log('文字起こし完了:', result.outputPath);
console.log('処理時間:', result.processingTime, '秒');

// バッチ処理
const results = await transcriber.transcribeBatch([
  './recording1.mp4',
  './recording2.mp4',
]);
```

## 出力形式

文字起こし結果はJSON形式で保存されます:

```json
{
  "text": "会議の文字起こしテキスト...",
  "segments": [
    {
      "start": 0.0,
      "end": 5.2,
      "text": "こんにちは、今日の会議を始めます。"
    },
    {
      "start": 5.2,
      "end": 10.8,
      "text": "まず最初の議題について説明します。"
    }
  ],
  "language": "ja"
}
```

## ワークフロー例

### 1. 定期的なZoom録画の自動処理

```bash
# 監視モードでツールを起動
npm run transcribe -- -w ~/Zoom/Recordings

# Zoomで録画を保存すると自動的に文字起こしが開始されます
```

### 2. 既存の録画を一括処理

```bash
# 録画ディレクトリ全体を処理
npm run transcribe -- -i ~/Zoom/Recordings -b
```

## トラブルシューティング

### FFmpegが見つからない

```
Error: ffmpeg not found
```

→ FFmpegをインストールしてください（セットアップ手順参照）

### OpenAI APIキーエラー

```
Error: OPENAI_API_KEY が設定されていません
```

→ `.env`ファイルを作成し、APIキーを設定してください

### ファイルサイズが大きすぎる

Whisper APIには25MBのファイルサイズ制限があります。長時間の録画は自動的に分割されますが、非常に長い場合はエラーになる可能性があります。

## 開発

### テストの実行

```bash
npm test
```

### リントチェック

```bash
npm run lint
```

### 型チェック

```bash
npm run typecheck
```

## ライセンス

MIT

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

## 謝辞

- [OpenAI Whisper](https://openai.com/research/whisper) - 文字起こしエンジン
- [FFmpeg](https://ffmpeg.org/) - 音声抽出
- [Miyabi Framework](https://github.com/miyabi-framework) - 自律開発フレームワーク
