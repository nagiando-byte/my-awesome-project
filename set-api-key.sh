#!/bin/bash
# OpenAI APIキー設定スクリプト

echo "🔑 OpenAI APIキー設定"
echo ""

# .envファイルの存在確認
if [ ! -f .env ]; then
    echo "ℹ️  .envファイルが見つかりません。作成します..."
    cp .env.example .env
fi

echo "OpenAI APIキーを設定します。"
echo ""
echo "APIキーの取得方法:"
echo "  1. https://platform.openai.com/api-keys にアクセス"
echo "  2. 「Create new secret key」をクリック"
echo "  3. キーをコピー（sk-proj-で始まる文字列）"
echo ""

# APIキーの入力
read -p "OpenAI APIキーを入力してください: " api_key

if [ -z "$api_key" ]; then
    echo "❌ APIキーが入力されませんでした"
    exit 1
fi

# APIキーの形式チェック
if [[ ! $api_key =~ ^sk- ]]; then
    echo "⚠️  警告: APIキーは通常 'sk-' で始まります"
    read -p "このまま続けますか? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# .envファイルを更新
if grep -q "OPENAI_API_KEY=" .env; then
    # 既存の行を置換（macOS対応）
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|" .env
    else
        sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|" .env
    fi
else
    # 新規追加
    echo "OPENAI_API_KEY=$api_key" >> .env
fi

echo ""
echo "✅ APIキーが設定されました!"
echo ""
echo "次のステップ:"
echo "  1. Zoomで録画"
echo "  2. npm run transcribe -- -i recordings/your-video.mp4"
echo ""

