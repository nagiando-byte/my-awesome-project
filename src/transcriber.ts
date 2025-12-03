/**
 * Zoom録画の自動文字起こしモジュール
 * OpenAI Whisper APIを使用して音声をテキストに変換
 */

import OpenAI from 'openai';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

export interface TranscriptionOptions {
  /** 入力動画ファイルのパス */
  inputPath: string;
  /** 出力テキストファイルのパス（省略時は自動生成） */
  outputPath?: string;
  /** 言語コード（省略時は自動検出） */
  language?: string;
  /** タイムスタンプを含めるか */
  includeTimestamps?: boolean;
}

export interface TranscriptionResult {
  /** 文字起こしテキスト */
  text: string;
  /** 出力ファイルパス */
  outputPath: string;
  /** 処理時間（秒） */
  processingTime: number;
}

export class ZoomTranscriber {
  private openai: OpenAI;
  private tempDir: string;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    this.tempDir = path.join(process.cwd(), '.temp');
  }

  /**
   * 動画ファイルから音声を抽出
   */
  private async extractAudio(videoPath: string): Promise<string> {
    // 一時ディレクトリの作成
    if (!fs.existsSync(this.tempDir)) {
      await fsPromises.mkdir(this.tempDir, { recursive: true });
    }

    const audioPath = path.join(
      this.tempDir,
      `audio_${Date.now()}.mp3`
    );

    return new Promise((resolve, reject) => {
      console.log('🎵 音声を抽出中...');
      ffmpeg(videoPath)
        .output(audioPath)
        .audioCodec('libmp3lame')
        .audioQuality(2) // 高品質
        .on('end', () => {
          console.log('✅ 音声抽出完了');
          resolve(audioPath);
        })
        .on('error', (err) => {
          console.error('❌ 音声抽出エラー:', err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * 音声ファイルをWhisper APIで文字起こし
   */
  private async transcribeAudio(
    audioPath: string,
    language?: string
  ): Promise<string> {
    console.log('🎤 文字起こし中...');

    const audioFile = fs.createReadStream(audioPath);

    const response = await this.openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language || 'ja', // デフォルトは日本語
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'],
    });

    console.log('✅ 文字起こし完了');
    return JSON.stringify(response, null, 2);
  }

  /**
   * 文字起こし結果をファイルに保存
   */
  private async saveTranscription(
    text: string,
    outputPath: string
  ): Promise<void> {
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      await fsPromises.mkdir(outputDir, { recursive: true });
    }

    await fsPromises.writeFile(outputPath, text, 'utf-8');
    console.log(`💾 文字起こし結果を保存: ${outputPath}`);
  }

  /**
   * 一時ファイルのクリーンアップ
   */
  private async cleanup(audioPath: string): Promise<void> {
    try {
      if (fs.existsSync(audioPath)) {
        await fsPromises.unlink(audioPath);
        console.log('🧹 一時ファイルを削除しました');
      }
    } catch (error) {
      console.warn('⚠️  一時ファイルの削除に失敗:', error);
    }
  }

  /**
   * Zoom録画を文字起こし（メインメソッド）
   */
  async transcribe(
    options: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    const startTime = Date.now();

    // 入力ファイルの確認
    if (!fs.existsSync(options.inputPath)) {
      throw new Error(`入力ファイルが見つかりません: ${options.inputPath}`);
    }

    // 出力パスの決定
    const outputPath =
      options.outputPath ||
      path.join(
        path.dirname(options.inputPath),
        `${path.basename(options.inputPath, path.extname(options.inputPath))}_transcript.json`
      );

    console.log('🚀 Zoom録画の文字起こしを開始');
    console.log(`📹 入力: ${options.inputPath}`);
    console.log(`📄 出力: ${outputPath}`);

    let audioPath = '';

    try {
      // 1. 音声抽出
      audioPath = await this.extractAudio(options.inputPath);

      // 2. 文字起こし
      const transcriptionText = await this.transcribeAudio(
        audioPath,
        options.language
      );

      // 3. 結果を保存
      await this.saveTranscription(transcriptionText, outputPath);

      // 4. 一時ファイルのクリーンアップ
      await this.cleanup(audioPath);

      const processingTime = (Date.now() - startTime) / 1000;

      console.log(`✅ 完了！ (処理時間: ${processingTime.toFixed(2)}秒)`);

      return {
        text: transcriptionText,
        outputPath,
        processingTime,
      };
    } catch (error) {
      // エラー時も一時ファイルをクリーンアップ
      if (audioPath) {
        await this.cleanup(audioPath);
      }
      throw error;
    }
  }

  /**
   * バッチ処理: 複数のファイルを一括文字起こし
   */
  async transcribeBatch(
    inputPaths: string[],
    options?: Partial<TranscriptionOptions>
  ): Promise<TranscriptionResult[]> {
    console.log(`📦 バッチ処理開始: ${inputPaths.length}ファイル`);

    const results: TranscriptionResult[] = [];

    for (let i = 0; i < inputPaths.length; i++) {
      console.log(`\n[${i + 1}/${inputPaths.length}] ${inputPaths[i]}`);
      try {
        const result = await this.transcribe({
          ...options,
          inputPath: inputPaths[i],
        });
        results.push(result);
      } catch (error) {
        console.error(`❌ エラー: ${inputPaths[i]}`, error);
      }
    }

    console.log(`\n✅ バッチ処理完了: ${results.length}/${inputPaths.length}件成功`);

    return results;
  }
}

