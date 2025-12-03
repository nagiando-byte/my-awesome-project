import { describe, it, expect, vi } from 'vitest';
import { ZoomTranscriber } from '../src/transcriber.js';

describe('ZoomTranscriber', () => {
  it('インスタンスを作成できる', () => {
    const transcriber = new ZoomTranscriber('test-api-key');
    expect(transcriber).toBeDefined();
  });

  it('環境変数からAPIキーを読み込める', () => {
    process.env.OPENAI_API_KEY = 'test-key';
    const transcriber = new ZoomTranscriber();
    expect(transcriber).toBeDefined();
  });

  it('存在しないファイルでエラーを投げる', async () => {
    const transcriber = new ZoomTranscriber('test-api-key');
    
    await expect(
      transcriber.transcribe({
        inputPath: './non-existent-file.mp4',
      })
    ).rejects.toThrow('入力ファイルが見つかりません');
  });
});

