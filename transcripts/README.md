# 文字起こし結果はここに保存されます

このフォルダには、文字起こし結果のJSONファイルが保存されます。

## ファイル形式

各文字起こし結果は以下の形式で保存されます:
- `元のファイル名_transcript.json`

例:
- `zoom_meeting.mp4` → `zoom_meeting_transcript.json`
- `recording_2024-12-03.mp4` → `recording_2024-12-03_transcript.json`

## JSONの内容

```json
{
  "text": "全体の文字起こしテキスト",
  "segments": [
    {
      "start": 0.0,
      "end": 5.2,
      "text": "セグメント単位のテキスト"
    }
  ],
  "language": "ja"
}
```

## 結果の確認方法

```bash
# JSONを整形して表示
cat transcript.json | jq .

# テキスト部分だけ抽出
cat transcript.json | jq -r .text

# ファイルで開く
open transcript.json
```

