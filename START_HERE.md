# 🎬 今すぐ使える!録画 → 文字起こし ガイド

## ✅ 準備完了しました!

### 📋 現在の状態

- ✅ FFmpegインストール済み
- ✅ 必要なパッケージインストール済み
- ✅ `recordings/` フォルダ作成済み
- ✅ `transcripts/` フォルダ作成済み
- ⚠️  OpenAI APIキーの設定が必要

---

## 🔑 ステップ1: OpenAI APIキーを設定

### APIキーをまだ持っていない場合:

1. [OpenAI Platform](https://platform.openai.com/signup)でアカウント作成
2. [APIキーページ](https://platform.openai.com/api-keys)へアクセス
3. 「Create new secret key」をクリック
4. キーをコピー

### APIキーを設定:

以下のコマンドを実行して`.env`ファイルを開く:
```bash
open .env
```

または、エディタで開く:
```bash
code .env  # VS Codeの場合
nano .env  # ターミナルの場合
```

`OPENAI_API_KEY=your-openai-api-key-here` を実際のAPIキーに置き換える:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

保存して閉じる。

---

## 🎥 ステップ2: Zoomで録画

### Zoom録画の設定:

1. Zoomを開く
2. 設定 → 記録 → ローカル記録を有効化
3. 保存先を確認（デフォルト: `~/Documents/Zoom`）

### 録画方法:

1. Zoom会議を開始
2. 「レコーディング」ボタンをクリック
3. 会議を進める
4. 会議終了後、自動的に変換される

録画ファイル（.mp4）が以下のいずれかに保存されます:
- `~/Documents/Zoom/` （macOSデフォルト）
- 指定した保存先

---

## 🎤 ステップ3: 文字起こしを実行

### 方法A: 手動で文字起こし（推奨 - 初回）

1. 録画ファイルを`recordings/`フォルダにコピー:
   ```bash
   cp ~/Documents/Zoom/2024-12-03\ 会議/zoom_0.mp4 recordings/
   ```

2. 文字起こしを実行:
   ```bash
   npm run transcribe -- -i recordings/zoom_0.mp4
   ```

3. 完了!結果は同じフォルダに`zoom_0_transcript.json`として保存されます

### 方法B: 自動監視モード（超便利!）

プロジェクトフォルダを監視して、新しい録画が追加されたら自動で文字起こし:

```bash
npm run transcribe -- -w recordings
```

このコマンドを実行したまま、別のターミナルで録画ファイルを`recordings/`にコピーすると自動処理されます!

### 方法C: Zoomフォルダを直接監視

```bash
npm run transcribe -- -w ~/Documents/Zoom
```

Zoomで録画すると自動的に文字起こし開始!（最強）

---

## 📊 出力の確認

文字起こしが完了すると、JSONファイルが作成されます:

```bash
# 結果を見る
cat recordings/zoom_0_transcript.json | jq .
```

または、エディタで開く:
```bash
open recordings/zoom_0_transcript.json
```

---

## 🚀 実行例

### 例1: 単一ファイル
```bash
npm run transcribe -- -i recordings/meeting.mp4
```

### 例2: 出力先を指定
```bash
npm run transcribe -- -i recordings/meeting.mp4 -o transcripts/meeting_2024-12-03.json
```

### 例3: 英語の録画
```bash
npm run transcribe -- -i recordings/english_meeting.mp4 -l en
```

### 例4: 複数ファイルを一括処理
```bash
npm run transcribe -- -i recordings -b
```

---

## 💰 料金について

OpenAI Whisper APIの料金:
- **$0.006 / 分**
- 1時間の録画 = 約 $0.36 (約50円)
- 非常に安価!

---

## ❓ よくある質問

### Q: どれくらい時間がかかる?
A: 通常、動画の長さの10-20%程度。1時間なら6-12分。

### Q: 精度はどのくらい?
A: OpenAI Whisperは非常に高精度で、日本語も正確に認識します。

### Q: オフラインで使える?
A: いいえ、OpenAI APIを使用するためインターネット接続が必要です。

### Q: 話者を識別できる?
A: 現在のバージョンでは話者識別は未実装ですが、拡張可能です。

---

## 🎯 実際にやってみよう!

**準備できました!以下の順序で進めてください:**

1. ✅ **APIキーを設定** (.envファイルを編集)
2. 🎥 **Zoomで録画** (短い録画でテストしてみてください)
3. 🎤 **文字起こし実行** (上記のコマンドを使用)

---

## 📞 サポート

問題が発生した場合:
1. `QUICKSTART.md`を確認
2. `README.md`を確認
3. GitHubでIssueを作成

---

**準備完了!録画を開始してください!** 🎬✨

