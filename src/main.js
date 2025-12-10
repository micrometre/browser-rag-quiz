/**
 * Main Application - Browser RAG Quiz
 * Combines WebLLM, Transformers.js embeddings, and vector store for
 * a 100% client-side RAG quiz experience
 */
import { embeddingService } from './embeddingService.js';
import { vectorStore } from './vectorStore.js';
import { llmService } from './llmService.js';
import { knowledgeBase, quizQuestions } from './knowledgeBase.js';

class QuizApp {
  constructor() {
    // State
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.results = [];
    this.score = 0;
    this.currentContext = '';
    this.isInitialized = false;

    // DOM Elements
    this.elements = {};
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleInit = this.handleInit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleHint = this.handleHint.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  /**
   * Initialize DOM elements and event listeners
   */
  init() {
    // Cache DOM elements
    this.elements = {
      // Status
      embeddingStatus: document.getElementById('embeddingStatus'),
      llmStatus: document.getElementById('llmStatus'),
      kbStatus: document.getElementById('kbStatus'),
      
      // Model selection
      modelSelection: document.getElementById('modelSelection'),
      llmSelect: document.getElementById('llmSelect'),
      initBtn: document.getElementById('initBtn'),
      progressContainer: document.getElementById('progressContainer'),
      progressFill: document.getElementById('progressFill'),
      progressText: document.getElementById('progressText'),
      
      // Quiz section
      quizSection: document.getElementById('quizSection'),
      questionNum: document.getElementById('questionNum'),
      scoreValue: document.getElementById('scoreValue'),
      correctCount: document.getElementById('correctCount'),
      questionTopic: document.getElementById('questionTopic'),
      questionText: document.getElementById('questionText'),
      contextToggle: document.getElementById('contextToggle'),
      contextContent: document.getElementById('contextContent'),
      retrievedContext: document.getElementById('retrievedContext'),
      answerInput: document.getElementById('answerInput'),
      hintBtn: document.getElementById('hintBtn'),
      submitBtn: document.getElementById('submitBtn'),
      
      // Feedback section
      feedbackSection: document.getElementById('feedbackSection'),
      feedbackHeader: document.getElementById('feedbackHeader'),
      feedbackContent: document.getElementById('feedbackContent'),
      nextBtn: document.getElementById('nextBtn'),
      
      // Results section
      resultsSection: document.getElementById('resultsSection'),
      finalScore: document.getElementById('finalScore'),
      finalCorrect: document.getElementById('finalCorrect'),
      finalTotal: document.getElementById('finalTotal'),
      finalPercent: document.getElementById('finalPercent'),
      summaryText: document.getElementById('summaryText'),
      restartBtn: document.getElementById('restartBtn'),
    };

    // Event listeners
    this.elements.initBtn.addEventListener('click', this.handleInit);
    this.elements.submitBtn.addEventListener('click', this.handleSubmit);
    this.elements.nextBtn.addEventListener('click', this.handleNext);
    this.elements.hintBtn.addEventListener('click', this.handleHint);
    this.elements.restartBtn.addEventListener('click', this.handleRestart);
    this.elements.contextToggle.addEventListener('click', () => {
      const content = this.elements.contextContent;
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
      this.elements.contextToggle.textContent = isHidden 
        ? '📚 Hide Retrieved Context' 
        : '📚 Show Retrieved Context';
    });

    // Allow Enter key to submit (with Shift+Enter for newline)
    this.elements.answerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    console.log('🎮 Quiz App initialized');
  }

  /**
   * Update progress display
   */
  updateProgress(message, progress) {
    this.elements.progressContainer.style.display = 'block';
    this.elements.progressText.textContent = message;
    this.elements.progressFill.style.width = `${progress}%`;
  }

  /**
   * Initialize all models and knowledge base
   */
  async handleInit() {
    const selectedModel = this.elements.llmSelect.value;
    
    this.elements.initBtn.disabled = true;
    this.elements.initBtn.textContent = 'Initializing...';
    
    try {
      // Step 1: Load embedding model
      this.updateProgress('Loading embedding model...', 0);
      this.elements.embeddingStatus.textContent = '🔄 Loading...';
      
      await embeddingService.initialize((progress) => {
        this.updateProgress(progress.message, progress.progress * 0.3);
      });
      
      this.elements.embeddingStatus.textContent = '✅ Ready';

      // Step 2: Index knowledge base
      this.updateProgress('Indexing knowledge base...', 30);
      this.elements.kbStatus.textContent = '🔄 Indexing...';
      
      await vectorStore.addDocuments(knowledgeBase, (progress) => {
        this.updateProgress(progress.message, 30 + progress.progress * 0.2);
      });
      
      this.elements.kbStatus.textContent = `✅ ${vectorStore.size} documents`;

      // Step 3: Load LLM
      this.updateProgress('Loading LLM (this may take a while)...', 50);
      this.elements.llmStatus.textContent = '🔄 Loading...';
      
      await llmService.initialize(selectedModel, (progress) => {
        this.updateProgress(progress.message, 50 + progress.progress * 0.5);
      });
      
      this.elements.llmStatus.textContent = '✅ Ready';

      // Ready to start
      this.isInitialized = true;
      this.updateProgress('Ready! Starting quiz...', 100);
      
      // Prepare questions (shuffle and pick 5)
      this.questions = this.shuffleArray([...quizQuestions]).slice(0, 5);
      this.currentQuestionIndex = 0;
      this.results = [];
      this.score = 0;

      // Start quiz after brief delay
      setTimeout(() => {
        this.elements.modelSelection.style.display = 'none';
        this.elements.quizSection.style.display = 'block';
        this.showQuestion();
      }, 500);

    } catch (error) {
      console.error('Initialization failed:', error);
      this.elements.progressText.textContent = `Error: ${error.message}`;
      this.elements.initBtn.disabled = false;
      this.elements.initBtn.innerHTML = '<span class="btn-icon">⚡</span> Retry Initialization';
      
      // Check for WebGPU support
      if (error.message.includes('WebGPU') || error.message.includes('adapter')) {
        this.elements.progressText.textContent = 
          'WebGPU not available. Please use Chrome 113+ with WebGPU enabled. See README for instructions.';
      }
    }
  }

  /**
   * Display current question
   */
  async showQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    
    // Update UI
    this.elements.questionNum.textContent = `${this.currentQuestionIndex + 1}/${this.questions.length}`;
    this.elements.correctCount.textContent = `${this.results.filter(r => r.isCorrect).length}/${this.currentQuestionIndex}`;
    this.elements.questionTopic.textContent = question.topic;
    this.elements.questionText.textContent = question.question;
    this.elements.answerInput.value = '';
    this.elements.answerInput.focus();
    
    // Reset feedback section
    this.elements.feedbackSection.style.display = 'none';
    this.elements.contextContent.style.display = 'none';
    this.elements.contextToggle.textContent = '📚 Show Retrieved Context';
    
    // Enable buttons
    this.elements.submitBtn.disabled = false;
    this.elements.hintBtn.disabled = false;
    
    // Retrieve context for this question (RAG)
    try {
      this.currentContext = await vectorStore.getContext(question.question, 2);
      this.elements.retrievedContext.textContent = this.currentContext;
    } catch (error) {
      console.error('Failed to retrieve context:', error);
      this.currentContext = '';
    }
  }

  /**
   * Handle answer submission
   */
  async handleSubmit() {
    const userAnswer = this.elements.answerInput.value.trim();
    
    if (!userAnswer) {
      alert('Please enter an answer!');
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    
    // Disable input while processing
    this.elements.submitBtn.disabled = true;
    this.elements.submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Evaluating...';
    this.elements.hintBtn.disabled = true;
    
    try {
      // Validate answer using LLM with RAG context
      const result = await llmService.validateAnswer(
        question.question,
        userAnswer,
        this.currentContext
      );

      // Store result
      this.results.push({
        question: question.question,
        topic: question.topic,
        userAnswer,
        isCorrect: result.isCorrect,
        score: result.score,
        feedback: result.feedback,
        correctAnswer: result.correctAnswer
      });

      // Update score
      this.score += result.score;
      this.elements.scoreValue.textContent = this.score;

      // Show feedback
      this.showFeedback(result);
      
    } catch (error) {
      console.error('Failed to validate answer:', error);
      alert('Error evaluating answer. Please try again.');
      this.elements.submitBtn.disabled = false;
      this.elements.submitBtn.innerHTML = '<span class="btn-icon">✓</span> Submit Answer';
      this.elements.hintBtn.disabled = false;
    }
  }

  /**
   * Display feedback for the answer
   */
  showFeedback(result) {
    this.elements.feedbackSection.style.display = 'block';
    
    // Set header based on correctness
    if (result.isCorrect) {
      this.elements.feedbackHeader.innerHTML = `
        <span class="feedback-icon correct">✓</span>
        <span class="feedback-title">Correct! (+${result.score} points)</span>
      `;
      this.elements.feedbackHeader.className = 'feedback-header correct';
    } else {
      this.elements.feedbackHeader.innerHTML = `
        <span class="feedback-icon incorrect">✗</span>
        <span class="feedback-title">Not quite right (+${result.score} points)</span>
      `;
      this.elements.feedbackHeader.className = 'feedback-header incorrect';
    }

    // Set feedback content
    this.elements.feedbackContent.innerHTML = `
      <p><strong>Feedback:</strong> ${result.feedback}</p>
      <p><strong>Complete Answer:</strong> ${result.correctAnswer}</p>
    `;

    // Update button text for last question
    if (this.currentQuestionIndex >= this.questions.length - 1) {
      this.elements.nextBtn.innerHTML = '<span class="btn-icon">🎉</span> See Results';
    } else {
      this.elements.nextBtn.innerHTML = '<span class="btn-icon">→</span> Next Question';
    }

    // Scroll to feedback
    this.elements.feedbackSection.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Handle hint request
   */
  async handleHint() {
    const question = this.questions[this.currentQuestionIndex];
    
    this.elements.hintBtn.disabled = true;
    this.elements.hintBtn.innerHTML = '<span class="btn-icon">⏳</span> Getting hint...';
    
    try {
      const hint = await llmService.generateHint(question.question, this.currentContext);
      alert(`💡 Hint: ${hint}`);
    } catch (error) {
      console.error('Failed to generate hint:', error);
      alert('Could not generate hint. Try again!');
    } finally {
      this.elements.hintBtn.disabled = false;
      this.elements.hintBtn.innerHTML = '<span class="btn-icon">💡</span> Get Hint';
    }
  }

  /**
   * Handle next question
   */
  async handleNext() {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex >= this.questions.length) {
      // Quiz complete - show results
      await this.showResults();
    } else {
      // Show next question
      this.elements.submitBtn.innerHTML = '<span class="btn-icon">✓</span> Submit Answer';
      this.showQuestion();
    }
  }

  /**
   * Show final results
   */
  async showResults() {
    this.elements.quizSection.style.display = 'none';
    this.elements.resultsSection.style.display = 'block';

    const correctCount = this.results.filter(r => r.isCorrect).length;
    const totalCount = this.results.length;
    const percentage = Math.round((correctCount / totalCount) * 100);

    this.elements.finalScore.textContent = this.score;
    this.elements.finalCorrect.textContent = correctCount;
    this.elements.finalTotal.textContent = totalCount;
    this.elements.finalPercent.textContent = `${percentage}%`;

    // Generate AI summary
    this.elements.summaryText.textContent = 'Generating personalized feedback...';
    
    try {
      const summary = await llmService.generateSummary(this.results);
      this.elements.summaryText.textContent = summary;
    } catch (error) {
      console.error('Failed to generate summary:', error);
      this.elements.summaryText.textContent = 
        `You answered ${correctCount} out of ${totalCount} questions correctly. ${
          percentage >= 80 ? 'Excellent work!' : 
          percentage >= 60 ? 'Good effort! Keep studying!' : 
          'Keep practicing, you\'ll get better!'
        }`;
    }
  }

  /**
   * Restart the quiz
   */
  handleRestart() {
    // Reset state
    this.currentQuestionIndex = 0;
    this.results = [];
    this.score = 0;
    this.elements.scoreValue.textContent = '0';
    
    // Shuffle and pick new questions
    this.questions = this.shuffleArray([...quizQuestions]).slice(0, 5);
    
    // Show quiz section
    this.elements.resultsSection.style.display = 'none';
    this.elements.quizSection.style.display = 'block';
    this.elements.submitBtn.innerHTML = '<span class="btn-icon">✓</span> Submit Answer';
    
    // Show first question
    this.showQuestion();
  }

  /**
   * Shuffle array (Fisher-Yates)
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new QuizApp();
  app.init();
});

export default QuizApp;
