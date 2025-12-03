# 🤖 Zoom録画自動文字起こし - 完全自動化ガイド

## 🌟 録画した瞬間に自動で文字起こし!

このガイドでは、Zoomで録画を終了した瞬間に自動的に検知して文字起こしを開始する設定を説明します。

---

## ⚡ 自動文字起こしデーモン

### 仕組み

1. **常駐プログラム**が`~/Documents/Zoom`フォルダを監視
2. **新しい録画ファイル**(.mp4/.mov)を検出
3. **自動的にコピー**して文字起こしを実行
4. **完了通知**をmacOSの通知センターに表示

### 特徴

- ✅ バックグラウンドで常時監視
- ✅ 録画完了を自動検知
- ✅ 重複処理を防ぐ
- ✅ 完了通知を表示
- ✅ ログで処理状況を確認可能
- ✅ 簡単に起動/停止可能

---

## 🚀 使い方

### ステップ1: APIキーを設定（初回のみ）

```bash
./set-api-key.sh
```

### ステップ2: 自動文字起こしを起動

```bash
./start-auto-transcribe.sh
```

これで準備完了!以下のように表示されます:

```
✅ Zoom録画自動文字起こしデーモン起動
ℹ️  監視中: /Users/nagi/Documents/Zoom
ℹ️  停止するには: ./stop-auto-transcribe.sh または Ctrl+C

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Zoomで録画を開始してください!
   録画が完了すると自動的に文字起こしを開始します
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### ステップ3: Zoomで録画

1. Zoom会議を開始
2. 「レコーディング」ボタンをクリック
3. 会議を進める
4. 会議を終了

**録画が完了すると自動的に文字起こしが開始されます!**

### ステップ4: 結果を確認

文字起こしが完了すると:
- macOSの通知が表示されます
- `recordings/`フォルダに録画と文字起こし結果が保存されます

```bash
# 結果を確認
ls -l recordings/

# 最新の文字起こし結果を開く
open recordings/*_transcript.json | tail -1
```

---

## 📊 管理コマンド

### 状態確認

```bash
./status-auto-transcribe.sh
```

現在の起動状態と最近のログを表示します。

### 停止

```bash
./stop-auto-transcribe.sh
```

### 再起動

```bash
./stop-auto-transcribe.sh
./start-auto-transcribe.sh
```

### ログをリアルタイム表示

```bash
tail -f auto-transcribe.log
```

---

## 🔄 macOSログイン時に自動起動（オプション）

毎回手動で起動するのが面倒な場合、macOSログイン時に自動起動する設定ができます。

### 自動起動を有効化

```bash
./enable-auto-start.sh
```

これで以下の場合に自動的に起動します:
- macOSログイン時
- プログラムがクラッシュした場合（自動再起動）

### 自動起動を無効化

```bash
./disable-auto-start.sh
```

---

## 📝 ワークフロー例

### パターン1: 手動起動（推奨 - 初めての方）

```bash
# 1. ターミナルを開く
cd "/Users/nagi/Library/CloudStorage/GoogleDrive-andonagi2011@gmail.com/マイドライブ/AI/miyabi test/my-awesome-project"

# 2. 自動文字起こしを起動
./start-auto-transcribe.sh

# 3. このターミナルはそのままにして、Zoomで録画
# （別ターミナルが必要な場合は、新しいタブを開く）

# 4. 録画完了後、自動的に処理開始
# 　 ログがリアルタイムで表示されます

# 5. 終了する場合は Ctrl+C または別ターミナルから
./stop-auto-transcribe.sh
```

### パターン2: バックグラウンド実行

```bash
# バックグラウンドで起動
./start-auto-transcribe.sh &

# ログを別ターミナルで監視（オプション）
tail -f auto-transcribe.log

# 停止
./stop-auto-transcribe.sh
```

### パターン3: 完全自動化（上級者向け）

```bash
# 一度設定すれば、あとは何もしなくてOK
./enable-auto-start.sh

# macOSを起動するだけで、常に監視状態に!
# Zoomで録画すれば自動的に文字起こし
```

---

## 🎯 実際の動作

### Zoom録画完了時の処理フロー:

```
1. Zoom会議終了
   ↓
2. Zoomが録画を ~/Documents/Zoom/ に保存
   ↓
3. 🤖 デーモンが新しいファイルを検出
   ↓
4. 📁 recordings/ フォルダにコピー
   ↓
5. 🎤 文字起こし開始
   ↓
6. 💾 結果を recordings/*_transcript.json に保存
   ↓
7. 🔔 macOS通知で完了をお知らせ
```

### ログ例:

```
[2024-12-03 21:30:45] ℹ️  監視中: /Users/nagi/Documents/Zoom
[2024-12-03 21:45:12] ✅ 新しい録画を検出: zoom_meeting.mp4
[2024-12-03 21:45:15] ℹ️  コピー中: zoom_meeting.mp4 → recordings/
[2024-12-03 21:45:18] ✅ コピー完了
[2024-12-03 21:45:18] 🎤 文字起こし開始: zoom_meeting.mp4
[2024-12-03 21:52:34] ✅ 文字起こし完了: zoom_meeting_transcript.json
```

---

## 🔍 トラブルシューティング

### デーモンが起動しない

```bash
# 状態確認
./status-auto-transcribe.sh

# ログを確認
cat auto-transcribe.log
```

### 録画を検出しない

**確認事項:**
1. Zoomの録画保存先が`~/Documents/Zoom`になっているか
2. デーモンが起動しているか（`./status-auto-transcribe.sh`）
3. 録画が完全に終了しているか（Zoomが変換完了するまで待つ）

**別の保存先を使用している場合:**

スクリプトを編集して保存先を変更:
```bash
# start-auto-transcribe.sh の3行目を編集
ZOOM_DIR="/your/custom/zoom/folder"
```

### 文字起こしが失敗する

```bash
# ログを確認
tail -30 auto-transcribe.log

# APIキーを確認
cat .env | grep OPENAI_API_KEY

# 手動で試してみる
npm run transcribe -- -i recordings/test.mp4
```

---

## 💡 Tips

### Tip 1: 通知をカスタマイズ

`start-auto-transcribe.sh`の通知部分を編集:
```bash
osascript -e "display notification \"カスタムメッセージ\" with title \"タイトル\""
```

### Tip 2: Slackに通知

文字起こし完了時にSlackに通知を送ることも可能:
```bash
# Slack Webhook URLを設定して
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"文字起こし完了!"}' \
  YOUR_SLACK_WEBHOOK_URL
```

### Tip 3: 処理済みファイルをクリア

```bash
# 処理済みリストをリセット（全ファイルを再処理したい場合）
rm .processed_files
```

---

## 📋 コマンドまとめ

| コマンド | 説明 |
|---------|------|
| `./start-auto-transcribe.sh` | 自動文字起こしを起動 |
| `./stop-auto-transcribe.sh` | 自動文字起こしを停止 |
| `./status-auto-transcribe.sh` | 状態確認 |
| `./enable-auto-start.sh` | macOSログイン時に自動起動 |
| `./disable-auto-start.sh` | 自動起動を無効化 |
| `tail -f auto-transcribe.log` | ログをリアルタイム表示 |

---

## 🎉 完全自動化の完成!

これで、**Zoomで録画するだけで自動的に文字起こし**が完了します!

```bash
# 今すぐ試してみましょう!
./start-auto-transcribe.sh
```

何か質問があれば、お気軽にお申し付けください! 🌸

