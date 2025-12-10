/**
 * Embedding Service using @huggingface/transformers
 * Runs entirely in the browser using ONNX runtime
 */
import { pipeline } from '@huggingface/transformers';

class EmbeddingService {
  constructor() {
    this.extractor = null;
    this.modelName = 'Xenova/all-MiniLM-L6-v2'; // Small, fast embedding model
    this.isLoading = false;
    this.isReady = false;
  }

  /**
   * Initialize the embedding model
   * @param {Function} progressCallback - Callback for loading progress
   */
  async initialize(progressCallback = null) {
    if (this.isReady) return;
    if (this.isLoading) {
      // Wait for existing load to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.isLoading = true;
    
    try {
      console.log('🔄 Loading embedding model:', this.modelName);
      
      this.extractor = await pipeline('feature-extraction', this.modelName, {
        dtype: 'fp32',
        device: 'wasm', // Use WASM to avoid conflicts with WebLLM's WebGPU usage
        progress_callback: (progress) => {
          if (progressCallback && progress.status === 'progress') {
            const percent = Math.round(progress.progress || 0);
            progressCallback({
              status: 'loading',
              progress: percent,
              message: `Loading embeddings: ${percent}%`
            });
          }
        }
      });
      
      this.isReady = true;
      console.log('✅ Embedding model loaded successfully');
      
      if (progressCallback) {
        progressCallback({
          status: 'ready',
          progress: 100,
          message: 'Embedding model ready'
        });
      }
    } catch (error) {
      console.error('❌ Failed to load embedding model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Generate embedding for a single text
   * @param {string} text - Text to embed
   * @returns {Array} - Embedding vector
   */
  async embed(text) {
    if (!this.isReady) {
      throw new Error('Embedding model not initialized');
    }

    const output = await this.extractor(text, {
      pooling: 'mean',
      normalize: true
    });

    // Return the embedding data as a regular array
    return Array.from(output.data);
  }

  /**
   * Generate embeddings for multiple texts
   * @param {string[]} texts - Array of texts to embed
   * @returns {Float32Array[]} - Array of embedding vectors
   */
  async embedBatch(texts) {
    if (!this.isReady) {
      throw new Error('Embedding model not initialized');
    }

    const embeddings = [];
    for (const text of texts) {
      const embedding = await this.embed(text);
      embeddings.push(embedding);
    }
    return embeddings;
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {Float32Array} a - First vector
   * @param {Float32Array} b - Second vector
   * @returns {number} - Similarity score (0-1)
   */
  cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService();
export default embeddingService;
