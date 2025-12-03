#!/bin/bash
# Zoom録画自動文字起こしデーモン
# Zoomの録画フォルダを監視して、新しい録画を自動的に文字起こし

# 設定
ZOOM_DIR="$HOME/Documents/Zoom"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$PROJECT_DIR/auto-transcribe.log"
PID_FILE="$PROJECT_DIR/auto-transcribe.pid"

# 色付きログ
log_info() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1" | tee -a "$LOG_FILE"
}

log_processing() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🎤 $1" | tee -a "$LOG_FILE"
}

# 既に起動しているかチェック
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        log_error "既に起動しています (PID: $OLD_PID)"
        echo "停止するには: ./stop-auto-transcribe.sh"
        exit 1
    else
        rm "$PID_FILE"
    fi
fi

# PIDファイルに保存
echo $$ > "$PID_FILE"

# 環境変数の確認
if [ ! -f "$PROJECT_DIR/.env" ]; then
    log_error ".envファイルが見つかりません"
    log_error "APIキーを設定してください: ./set-api-key.sh"
    rm "$PID_FILE"
    exit 1
fi

# Zoomフォルダの確認
if [ ! -d "$ZOOM_DIR" ]; then
    log_error "Zoomフォルダが見つかりません: $ZOOM_DIR"
    log_info "Zoomの設定で録画の保存先を確認してください"
    rm "$PID_FILE"
    exit 1
fi

log_success "🌸 Zoom録画自動文字起こしデーモン起動"
log_info "監視中: $ZOOM_DIR"
log_info "ログ: $LOG_FILE"
log_info "停止するには: ./stop-auto-transcribe.sh または Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎬 Zoomで録画を開始してください!"
echo "   録画が完了すると自動的に文字起こしを開始します"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 処理済みファイルを記録
PROCESSED_FILES="$PROJECT_DIR/.processed_files"
touch "$PROCESSED_FILES"

# クリーンアップ処理
cleanup() {
    log_info "シャットダウン中..."
    rm -f "$PID_FILE"
    exit 0
}

trap cleanup SIGINT SIGTERM

# 新しいファイルを検出する関数
process_new_files() {
    # Zoomフォルダ内の全mp4ファイルを検索
    find "$ZOOM_DIR" -type f -name "*.mp4" -o -name "*.mov" | while read -r file; do
        # 既に処理済みかチェック
        if grep -Fxq "$file" "$PROCESSED_FILES"; then
            continue
        fi
        
        # ファイルが完全に書き込まれるまで待つ（ファイルサイズが安定するまで）
        local prev_size=0
        local curr_size=$(stat -f%z "$file" 2>/dev/null || echo 0)
        
        if [ "$curr_size" -eq 0 ]; then
            continue
        fi
        
        # ファイルサイズが変わらなくなったら処理開始
        sleep 5
        local new_size=$(stat -f%z "$file" 2>/dev/null || echo 0)
        
        if [ "$curr_size" -ne "$new_size" ]; then
            # まだ書き込み中
            continue
        fi
        
        # 新しい録画を発見!
        local filename=$(basename "$file")
        log_success "新しい録画を検出: $filename"
        
        # 処理済みリストに追加（重複処理を防ぐ）
        echo "$file" >> "$PROCESSED_FILES"
        
        # recordingsフォルダにコピー
        local recordings_dir="$PROJECT_DIR/recordings"
        local copied_file="$recordings_dir/$filename"
        
        log_info "コピー中: $filename → recordings/"
        cp "$file" "$copied_file"
        
        if [ $? -eq 0 ]; then
            log_success "コピー完了"
            
            # 文字起こし実行
            log_processing "文字起こし開始: $filename"
            
            cd "$PROJECT_DIR"
            npm run transcribe -- -i "$copied_file" >> "$LOG_FILE" 2>&1
            
            if [ $? -eq 0 ]; then
                log_success "文字起こし完了: ${filename%.*}_transcript.json"
                
                # macOSの通知を送信
                if command -v osascript &> /dev/null; then
                    osascript -e "display notification \"$filename の文字起こしが完了しました\" with title \"Zoom録画文字起こし\" sound name \"Glass\""
                fi
            else
                log_error "文字起こしに失敗: $filename"
            fi
        else
            log_error "コピーに失敗: $filename"
        fi
        
        echo ""
        log_info "次の録画を待機中..."
        echo ""
    done
}

# メインループ - Zoomフォルダを定期的にスキャン
while true; do
    process_new_files
    sleep 10  # 10秒ごとにチェック
done

