/**
 * Vector Store for RAG
 * In-memory vector database with optional IndexedDB persistence
 */
import { embeddingService } from './embeddingService.js';

class VectorStore {
  constructor() {
    this.documents = [];
    this.embeddings = [];
    this.isIndexed = false;
  }

  /**
   * Add documents to the vector store
   * @param {Array<{id: string, content: string, metadata: object}>} docs - Documents to add
   * @param {Function} progressCallback - Progress callback
   */
  async addDocuments(docs, progressCallback = null) {
    console.log(`📚 Indexing ${docs.length} documents...`);
    
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const embedding = await embeddingService.embed(doc.content);
      
      this.documents.push({
        id: doc.id || `doc_${i}`,
        content: doc.content,
        metadata: doc.metadata || {}
      });
      this.embeddings.push(embedding);
      
      if (progressCallback) {
        progressCallback({
          status: 'indexing',
          progress: Math.round(((i + 1) / docs.length) * 100),
          message: `Indexing document ${i + 1}/${docs.length}`
        });
      }
    }
    
    this.isIndexed = true;
    console.log('✅ Documents indexed successfully');
  }

  /**
   * Search for similar documents
   * @param {string} query - Search query
   * @param {number} topK - Number of results to return
   * @returns {Array<{document: object, score: number}>} - Ranked results
   */
  async search(query, topK = 3) {
    if (!this.isIndexed || this.documents.length === 0) {
      throw new Error('Vector store is empty. Add documents first.');
    }

    // Get query embedding
    const queryEmbedding = await embeddingService.embed(query);
    
    // Calculate similarities
    const similarities = this.embeddings.map((embedding, index) => ({
      index,
      score: embeddingService.cosineSimilarity(queryEmbedding, embedding)
    }));
    
    // Sort by similarity (descending)
    similarities.sort((a, b) => b.score - a.score);
    
    // Return top K results
    return similarities.slice(0, topK).map(item => ({
      document: this.documents[item.index],
      score: item.score
    }));
  }

  /**
   * Get context string from search results
   * @param {string} query - Search query
   * @param {number} topK - Number of documents to retrieve
   * @returns {string} - Concatenated context
   */
  async getContext(query, topK = 3) {
    const results = await this.search(query, topK);
    
    return results.map((r, i) => 
      `[Source ${i + 1}] ${r.document.content}`
    ).join('\n\n');
  }

  /**
   * Clear all documents
   */
  clear() {
    this.documents = [];
    this.embeddings = [];
    this.isIndexed = false;
  }

  /**
   * Get document count
   */
  get size() {
    return this.documents.length;
  }
}

// Export singleton instance
export const vectorStore = new VectorStore();
export default vectorStore;
