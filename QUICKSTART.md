# クイックスタートガイド 🚀

Zoom録画の自動文字起こしツールを5分でセットアップ!

## ステップ1: FFmpegのインストール

### macOSの場合:
```bash
brew install ffmpeg
```

### Windowsの場合:
1. [FFmpeg公式サイト](https://ffmpeg.org/download.html)からダウンロード
2. インストーラーを実行

### Linuxの場合:
```bash
sudo apt update && sudo apt install ffmpeg
```

## ステップ2: OpenAI APIキーの取得

1. [OpenAI Platform](https://platform.openai.com/signup)でアカウント作成（まだの場合）
2. [APIキーページ](https://platform.openai.com/api-keys)へアクセス
3. 「Create new secret key」をクリック
4. キーをコピー（後で使用します）

## ステップ3: プロジェクトのセットアップ

```bash
# 依存関係のインストール
npm install

# .envファイルを作成
cp .env.example .env
```

## ステップ4: APIキーの設定

`.env`ファイルを開いて、コピーしたAPIキーを貼り付け:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ステップ5: 文字起こしを実行!

### シンプルな使い方

```bash
# Zoom録画ファイルを指定
npm run transcribe -- -i ./your-zoom-recording.mp4
```

処理が完了すると、同じディレクトリに`your-zoom-recording_transcript.json`が作成されます。

### 自動監視モード（おすすめ!）

```bash
# Zoomの録画フォルダを監視
npm run transcribe -- -w ~/Documents/Zoom

# このまま起動しておくと、新しい録画が保存されるたびに自動で文字起こしされます
```

## 出力例

```json
{
  "text": "皆さん、こんにちは。本日の会議を始めます...",
  "segments": [
    {
      "start": 0.0,
      "end": 3.5,
      "text": "皆さん、こんにちは。"
    },
    {
      "start": 3.5,
      "end": 7.2,
      "text": "本日の会議を始めます。"
    }
  ],
  "language": "ja"
}
```

## よくある質問

### Q: 料金はかかりますか？

A: OpenAI Whisper APIの料金は、1分あたり$0.006です。1時間の録画で約$0.36（約50円程度）です。

### Q: どれくらい時間がかかりますか？

A: 通常、動画の長さの10-20%程度です。1時間の録画なら6-12分程度で完了します。

### Q: 対応している動画形式は？

A: MP4, MOV, AVI, MKV, WebMなど、FFmpegが対応している形式すべてです。

### Q: 日本語以外も使えますか？

A: はい!言語を指定できます:

```bash
# 英語
npm run transcribe -- -i recording.mp4 -l en

# 中国語
npm run transcribe -- -i recording.mp4 -l zh
```

## トラブルシューティング

### エラー: `ffmpeg not found`

→ FFmpegがインストールされているか確認:
```bash
ffmpeg -version
```

インストールされていない場合は、ステップ1を実行してください。

### エラー: `OPENAI_API_KEY が設定されていません`

→ `.env`ファイルが正しく作成されているか確認:
```bash
cat .env
```

APIキーが設定されていない場合は、ステップ3-4を実行してください。

## 次のステップ

- 📖 詳しい使い方は`README.md`を参照
- 🐛 問題が発生したらGitHubでIssueを作成
- ⭐ プロジェクトが役に立ったらスターをお願いします!

---

**🎉 セットアップ完了!文字起こしを楽しんでください!**

