#!/bin/bash
# macOSログイン時に自動文字起こしデーモンを自動起動する設定

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLIST_FILE="$HOME/Library/LaunchAgents/com.zoom.auto-transcribe.plist"

echo "🔧 macOSログイン時の自動起動を設定します"
echo ""

# LaunchAgentsフォルダを作成
mkdir -p "$HOME/Library/LaunchAgents"

# plistファイルを作成
cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.zoom.auto-transcribe</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>$PROJECT_DIR/start-auto-transcribe.sh</string>
    </array>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>KeepAlive</key>
    <true/>
    
    <key>StandardOutPath</key>
    <string>$PROJECT_DIR/auto-transcribe.log</string>
    
    <key>StandardErrorPath</key>
    <string>$PROJECT_DIR/auto-transcribe-error.log</string>
    
    <key>WorkingDirectory</key>
    <string>$PROJECT_DIR</string>
</dict>
</plist>
EOF

echo "✅ 設定ファイルを作成しました: $PLIST_FILE"
echo ""

# LaunchAgentを読み込み
launchctl unload "$PLIST_FILE" 2>/dev/null
launchctl load "$PLIST_FILE"

if [ $? -eq 0 ]; then
    echo "✅ 自動起動が有効になりました!"
    echo ""
    echo "これで以下のタイミングで自動文字起こしが起動します:"
    echo "  - macOSログイン時"
    echo "  - クラッシュ時（自動再起動）"
    echo ""
    echo "管理コマンド:"
    echo "  状態確認: ./status-auto-transcribe.sh"
    echo "  停止:     ./stop-auto-transcribe.sh"
    echo "  再起動:   launchctl kickstart -k gui/\$(id -u)/com.zoom.auto-transcribe"
    echo ""
    echo "自動起動を無効化するには:"
    echo "  ./disable-auto-start.sh"
else
    echo "❌ 自動起動の設定に失敗しました"
    exit 1
fi

