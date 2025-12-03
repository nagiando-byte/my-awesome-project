#!/bin/bash
# macOSログイン時の自動起動を無効化

PLIST_FILE="$HOME/Library/LaunchAgents/com.zoom.auto-transcribe.plist"

echo "🔧 自動起動を無効化します"
echo ""

if [ -f "$PLIST_FILE" ]; then
    launchctl unload "$PLIST_FILE" 2>/dev/null
    rm "$PLIST_FILE"
    echo "✅ 自動起動を無効化しました"
    echo ""
    echo "再度有効化するには:"
    echo "  ./enable-auto-start.sh"
else
    echo "ℹ️  自動起動は設定されていません"
fi

