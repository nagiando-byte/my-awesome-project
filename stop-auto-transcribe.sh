#!/bin/bash
# Zoom録画自動文字起こしデーモンを停止

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$PROJECT_DIR/auto-transcribe.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "❌ 自動文字起こしデーモンは起動していません"
    exit 1
fi

PID=$(cat "$PID_FILE")

if ps -p "$PID" > /dev/null 2>&1; then
    echo "🛑 自動文字起こしデーモンを停止中... (PID: $PID)"
    kill "$PID"
    sleep 1
    
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "⚠️  強制終了します..."
        kill -9 "$PID"
    fi
    
    rm -f "$PID_FILE"
    echo "✅ 停止しました"
else
    echo "⚠️  プロセスが見つかりません (PID: $PID)"
    rm -f "$PID_FILE"
fi

