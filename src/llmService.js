/**
 * LLM Service using Transformers.js with Flan-T5
 * Runs text-to-text generation entirely in the browser using ONNX runtime
 */
import { pipeline } from '@huggingface/transformers';

// Available models for text generation
export const AVAILABLE_MODELS = {
  'Xenova/flan-t5-small': { name: 'Flan-T5 Small', size: '~250MB', description: 'Fast & lightweight' },
  'Xenova/flan-t5-base': { name: 'Flan-T5 Base', size: '~500MB', description: 'Better quality' },
  'Xenova/LaMini-Flan-T5-248M': { name: 'LaMini Flan-T5', size: '~250MB', description: 'Instruction tuned' },
};

class LLMService {
  constructor() {
    this.generator = null;
    this.modelId = null;
    this.isLoading = false;
    this.isReady = false;
  }

  /**
   * Initialize the text generation pipeline with a specific model
   * @param {string} modelId - The model ID to load (e.g., 'Xenova/flan-t5-small')
   * @param {Function} progressCallback - Callback for loading progress
   */
  async initialize(modelId = 'Xenova/flan-t5-small', progressCallback = null) {
    if (this.isReady && this.modelId === modelId) return;
    
    this.isLoading = true;
    this.modelId = modelId;

    try {
      console.log('🔄 Loading LLM model:', modelId);

      this.generator = await pipeline('text2text-generation', modelId, {
        dtype: 'fp32',
        device: 'wasm', // Use WASM for broad compatibility
        progress_callback: (progress) => {
          if (progressCallback && progress.status === 'progress') {
            const percent = Math.round(progress.progress || 0);
            progressCallback({
              status: 'loading',
              progress: percent,
              message: `Loading LLM: ${percent}%`
            });
          }
        }
      });

      this.isReady = true;
      console.log('✅ LLM model loaded successfully');

      if (progressCallback) {
        progressCallback({
          status: 'ready',
          progress: 100,
          message: 'LLM model ready'
        });
      }
    } catch (error) {
      console.error('❌ Failed to load LLM model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Generate a response from the LLM
   * @param {string} prompt - The prompt to send
   * @param {object} options - Generation options
   * @returns {string} - Generated response
   */
  async generate(prompt, options = {}) {
    if (!this.isReady) {
      throw new Error('LLM not initialized');
    }

    const defaultOptions = {
      max_new_tokens: 256,
      temperature: 0.7,
      do_sample: true,
      top_p: 0.95,
    };

    const config = { ...defaultOptions, ...options };

    const result = await this.generator(prompt, {
      max_new_tokens: config.max_new_tokens || config.max_tokens,
      temperature: config.temperature,
      do_sample: config.do_sample,
      top_p: config.top_p,
    });

    return result[0].generated_text;
  }

  /**
   * Generate a streaming response (simulated for compatibility)
   * Note: Transformers.js doesn't support true streaming, so we simulate it
   * @param {string} prompt - The prompt to send
   * @param {Function} onChunk - Callback for each token
   * @param {object} options - Generation options
   */
  async generateStream(prompt, onChunk, options = {}) {
    // Generate full response first
    const response = await this.generate(prompt, options);
    
    // Simulate streaming by splitting into words
    const words = response.split(' ');
    let fullResponse = '';
    
    for (const word of words) {
      const chunk = (fullResponse ? ' ' : '') + word;
      fullResponse += chunk;
      if (onChunk) {
        onChunk(chunk, fullResponse);
      }
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    return fullResponse;
  }

  /**
   * Validate a quiz answer using RAG context
   * @param {string} question - The quiz question
   * @param {string} userAnswer - The user's answer
   * @param {string} context - Retrieved context from knowledge base
   * @returns {object} - Validation result with isCorrect, score, and feedback
   */
  async validateAnswer(question, userAnswer, context) {
    // Flan-T5 works best with concise, direct prompts
    const prompt = `Context: ${context.substring(0, 500)}

Question: ${question}
Student Answer: ${userAnswer}

Grade this answer as correct or incorrect and explain why in one sentence:`;

    const response = await this.generate(prompt, { max_new_tokens: 100, temperature: 0.3 });
    
    // Parse the response to determine correctness
    const lowerResponse = response.toLowerCase();
    const isCorrect = lowerResponse.includes('correct') && !lowerResponse.includes('incorrect');
    const hasPartial = lowerResponse.includes('partial') || lowerResponse.includes('partly');
    
    let score;
    if (isCorrect && !hasPartial) {
      score = 100;
    } else if (hasPartial || (isCorrect && hasPartial)) {
      score = 60;
    } else {
      score = 20;
    }

    // Get the correct answer from context
    const correctAnswerPrompt = `Based on this context, what is the answer to: ${question}
Context: ${context.substring(0, 400)}
Answer:`;
    
    const correctAnswer = await this.generate(correctAnswerPrompt, { max_new_tokens: 80, temperature: 0.2 });

    return {
      isCorrect: score >= 60,
      score,
      feedback: response,
      correctAnswer: correctAnswer
    };
  }

  /**
   * Generate a hint for a question
   * @param {string} question - The quiz question
   * @param {string} context - Retrieved context
   * @returns {string} - A helpful hint
   */
  async generateHint(question, context) {
    const prompt = `Give a brief hint for this question without revealing the answer.
Question: ${question}
Context: ${context.substring(0, 300)}
Hint:`;

    return await this.generate(prompt, { max_new_tokens: 60, temperature: 0.5 });
  }

  /**
   * Generate final quiz summary
   * @param {Array} results - Array of question results
   * @returns {string} - Personalized summary
   */
  async generateSummary(results) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    
    const topics = [...new Set(results.map(r => r.topic))].join(', ');
    const weakTopics = results
      .filter(r => !r.isCorrect)
      .map(r => r.topic)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');

    const prompt = `Write encouraging feedback for a student who scored ${correctCount}/${totalCount} (${percentage}%) on a quiz about ${topics}. ${weakTopics ? `They need to improve on: ${weakTopics}.` : 'They did great on all topics!'} Be brief and motivating:`;

    return await this.generate(prompt, { max_new_tokens: 100, temperature: 0.7 });
  }

  /**
   * Reset the service (no-op for Transformers.js, kept for API compatibility)
   */
  async reset() {
    // No reset needed for Transformers.js pipeline
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;
