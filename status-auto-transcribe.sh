#!/bin/bash
# Zoom録画自動文字起こしデーモンの状態確認

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$PROJECT_DIR/auto-transcribe.pid"
LOG_FILE="$PROJECT_DIR/auto-transcribe.log"

echo "🔍 Zoom録画自動文字起こしデーモン - 状態確認"
echo ""

# 起動状態の確認
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "✅ 起動中 (PID: $PID)"
        
        # プロセス情報
        echo ""
        echo "プロセス情報:"
        ps -p "$PID" -o pid,etime,command | tail -n +2
        
    else
        echo "❌ 停止中 (PIDファイルは残っています)"
        rm -f "$PID_FILE"
    fi
else
    echo "❌ 停止中"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ログファイルの確認
if [ -f "$LOG_FILE" ]; then
    echo ""
    echo "📋 最近のログ (最新10件):"
    echo ""
    tail -n 10 "$LOG_FILE"
else
    echo ""
    echo "ℹ️  ログファイルがまだありません"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "コマンド:"
echo "  起動: ./start-auto-transcribe.sh"
echo "  停止: ./stop-auto-transcribe.sh"
echo "  ログ: tail -f auto-transcribe.log"
echo ""

