#!/bin/bash
# Zoom録画 自動文字起こし - セットアップスクリプト

echo "🌸 Zoom録画 自動文字起こしツール - セットアップ"
echo ""

# 1. FFmpegの確認
echo "1️⃣  FFmpegの確認..."
if command -v ffmpeg &> /dev/null; then
    echo "   ✅ FFmpegがインストールされています"
    ffmpeg -version | head -n 1
else
    echo "   ❌ FFmpegがインストールされていません"
    echo "   以下のコマンドでインストールしてください:"
    echo "   brew install ffmpeg"
    exit 1
fi

echo ""

# 2. .envファイルの確認
echo "2️⃣  環境変数の設定..."
if [ -f .env ]; then
    if grep -q "OPENAI_API_KEY=sk-" .env; then
        echo "   ✅ OPENAI_API_KEYが設定されています"
    elif grep -q "OPENAI_API_KEY=your-openai-api-key-here" .env; then
        echo "   ⚠️  OPENAI_API_KEYを設定してください"
        echo ""
        echo "   手順:"
        echo "   1. https://platform.openai.com/api-keys でAPIキーを取得"
        echo "   2. .envファイルを開く: open .env"
        echo "   3. OPENAI_API_KEY=your-openai-api-key-here を実際のAPIキーに置き換える"
        echo ""
        read -p "   今すぐ.envファイルを開きますか? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open .env
        fi
    else
        echo "   ⚠️  OPENAI_API_KEYが正しく設定されていない可能性があります"
    fi
else
    echo "   ℹ️  .envファイルを作成しています..."
    cp .env.example .env
    echo "   ⚠️  .envファイルにOPENAI_API_KEYを設定してください"
    echo ""
    echo "   手順:"
    echo "   1. https://platform.openai.com/api-keys でAPIキーを取得"
    echo "   2. .envファイルを開く: open .env"
    echo "   3. OPENAI_API_KEY=your-openai-api-key-here を実際のAPIキーに置き換える"
fi

echo ""

# 3. 録画フォルダの作成
echo "3️⃣  録画フォルダの準備..."
if [ ! -d "recordings" ]; then
    mkdir -p recordings
    echo "   ✅ recordingsフォルダを作成しました"
else
    echo "   ✅ recordingsフォルダが存在します"
fi

if [ ! -d "transcripts" ]; then
    mkdir -p transcripts
    echo "   ✅ transcriptsフォルダを作成しました"
else
    echo "   ✅ transcriptsフォルダが存在します"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 セットアップ完了!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 次のステップ:"
echo ""
echo "  1. Zoomで録画してファイルを保存"
echo "     例: zoom_meeting.mp4 を recordings/ フォルダに保存"
echo ""
echo "  2. 文字起こしを実行:"
echo "     npm run transcribe -- -i recordings/zoom_meeting.mp4"
echo ""
echo "  3. または、監視モードで自動処理:"
echo "     npm run transcribe -- -w recordings"
echo ""
echo "💡 ヒント:"
echo "  - Zoomの録画設定でローカル保存を有効にしてください"
echo "  - デフォルトの保存先: ~/Documents/Zoom"
echo ""

