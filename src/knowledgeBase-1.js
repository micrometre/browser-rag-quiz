/**
 * Knowledge Base - Educational content for the quiz
 * This is the RAG knowledge base that will be indexed and searched
 */

export const knowledgeBase = [
  // Python Basics
  {
    id: 'python_basics_1',
    content: 'Python is a high-level, interpreted programming language known for its simple and readable syntax. It was created by Guido van Rossum and first released in 1991. Python supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
    metadata: { topic: 'Python', subtopic: 'Basics' }
  },
  {
    id: 'python_basics_2',
    content: 'In Python, indentation is used to define code blocks instead of curly braces. This makes Python code visually clean and enforces readable code structure. The standard indentation is 4 spaces. Python uses dynamic typing, meaning you do not need to declare variable types explicitly.',
    metadata: { topic: 'Python', subtopic: 'Syntax' }
  },
  {
    id: 'python_data_types',
    content: 'Python has several built-in data types: integers (int), floating-point numbers (float), strings (str), booleans (bool), lists (mutable sequences), tuples (immutable sequences), dictionaries (key-value pairs), and sets (unique unordered collections). Lists are created with square brackets [], tuples with parentheses (), and dictionaries with curly braces {}.',
    metadata: { topic: 'Python', subtopic: 'Data Types' }
  },
  {
    id: 'python_functions',
    content: 'Functions in Python are defined using the def keyword followed by the function name and parentheses. Python supports default arguments, keyword arguments, and variable-length arguments (*args and **kwargs). Lambda functions are anonymous functions defined with the lambda keyword for simple one-line operations.',
    metadata: { topic: 'Python', subtopic: 'Functions' }
  },

  // Machine Learning
  {
    id: 'ml_basics_1',
    content: 'Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. There are three main types: supervised learning (learning from labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error with rewards).',
    metadata: { topic: 'Machine Learning', subtopic: 'Basics' }
  },
  {
    id: 'ml_supervised',
    content: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs. Common algorithms include Linear Regression for predicting continuous values, Logistic Regression for binary classification, Decision Trees, Random Forests, and Support Vector Machines (SVM). The data is split into training and test sets to evaluate model performance.',
    metadata: { topic: 'Machine Learning', subtopic: 'Supervised Learning' }
  },
  {
    id: 'ml_unsupervised',
    content: 'Unsupervised learning finds hidden patterns in data without labeled responses. K-Means clustering groups similar data points together. Principal Component Analysis (PCA) reduces dimensionality while preserving variance. Hierarchical clustering creates a tree of clusters. These techniques are used for customer segmentation, anomaly detection, and data compression.',
    metadata: { topic: 'Machine Learning', subtopic: 'Unsupervised Learning' }
  },
  {
    id: 'ml_neural_networks',
    content: 'Neural networks are computing systems inspired by biological neural networks. They consist of layers of interconnected nodes (neurons). Deep learning uses neural networks with many layers. Common architectures include Convolutional Neural Networks (CNNs) for images, Recurrent Neural Networks (RNNs) for sequences, and Transformers for natural language processing.',
    metadata: { topic: 'Machine Learning', subtopic: 'Neural Networks' }
  },

  // Large Language Models
  {
    id: 'llm_basics',
    content: 'Large Language Models (LLMs) are neural networks trained on vast amounts of text data to understand and generate human language. They use the Transformer architecture with self-attention mechanisms. Examples include GPT (Generative Pre-trained Transformer), BERT, LLaMA, and Claude. LLMs can perform tasks like text generation, translation, summarization, and question answering.',
    metadata: { topic: 'LLM', subtopic: 'Basics' }
  },
  {
    id: 'llm_transformers',
    content: 'The Transformer architecture, introduced in the paper "Attention Is All You Need" (2017), revolutionized NLP. It uses self-attention to process all input tokens in parallel, unlike RNNs which process sequentially. Key components include multi-head attention, positional encoding, and feed-forward layers. This architecture enables efficient training on large datasets.',
    metadata: { topic: 'LLM', subtopic: 'Transformers' }
  },
  {
    id: 'llm_rag',
    content: 'Retrieval-Augmented Generation (RAG) combines LLMs with external knowledge retrieval. Instead of relying solely on trained knowledge, RAG systems retrieve relevant documents from a knowledge base and include them in the prompt context. This reduces hallucinations, enables up-to-date information, and allows domain-specific knowledge without fine-tuning.',
    metadata: { topic: 'LLM', subtopic: 'RAG' }
  },
  {
    id: 'llm_prompting',
    content: 'Prompt engineering is the practice of designing effective prompts to get desired outputs from LLMs. Techniques include zero-shot prompting (no examples), few-shot prompting (providing examples), chain-of-thought prompting (encouraging step-by-step reasoning), and system prompts (setting context and behavior). Good prompts are clear, specific, and provide necessary context.',
    metadata: { topic: 'LLM', subtopic: 'Prompting' }
  },

  // Web Development
  {
    id: 'web_html',
    content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It uses elements like <div>, <p>, <h1>-<h6>, <a>, <img>, and <form> to structure content. HTML5 introduced semantic elements like <header>, <nav>, <article>, <section>, and <footer> for better document structure and accessibility.',
    metadata: { topic: 'Web Development', subtopic: 'HTML' }
  },
  {
    id: 'web_css',
    content: 'CSS (Cascading Style Sheets) controls the visual presentation of HTML elements. It uses selectors to target elements and properties to style them. Modern CSS includes Flexbox for one-dimensional layouts, Grid for two-dimensional layouts, and CSS variables for reusable values. Media queries enable responsive design for different screen sizes.',
    metadata: { topic: 'Web Development', subtopic: 'CSS' }
  },
  {
    id: 'web_javascript',
    content: 'JavaScript is a dynamic programming language that enables interactive web pages. It runs in the browser and can manipulate the DOM (Document Object Model). Modern JavaScript (ES6+) includes features like arrow functions, template literals, destructuring, promises, async/await, and modules. JavaScript is also used server-side with Node.js.',
    metadata: { topic: 'Web Development', subtopic: 'JavaScript' }
  },
  {
    id: 'web_apis',
    content: 'Web APIs allow JavaScript to interact with browser features. The Fetch API makes HTTP requests. The Web Storage API (localStorage, sessionStorage) stores data locally. WebGPU provides GPU acceleration for graphics and compute. The Web Workers API enables background processing. IndexedDB stores large amounts of structured data.',
    metadata: { topic: 'Web Development', subtopic: 'Web APIs' }
  },

  // Data Science
  {
    id: 'ds_pandas',
    content: 'Pandas is a Python library for data manipulation and analysis. It provides DataFrame (2D table) and Series (1D array) data structures. Key operations include reading data (read_csv, read_json), filtering (df[condition]), grouping (groupby), merging (merge, join), and aggregation (sum, mean, count). Pandas integrates well with NumPy and visualization libraries.',
    metadata: { topic: 'Data Science', subtopic: 'Pandas' }
  },
  {
    id: 'ds_numpy',
    content: 'NumPy is the fundamental package for numerical computing in Python. It provides the ndarray (n-dimensional array) object for efficient numerical operations. NumPy supports broadcasting, vectorized operations, linear algebra, random number generation, and Fourier transforms. It is much faster than Python lists for numerical computations.',
    metadata: { topic: 'Data Science', subtopic: 'NumPy' }
  },
  {
    id: 'ds_visualization',
    content: 'Data visualization in Python commonly uses Matplotlib and Seaborn. Matplotlib is a comprehensive library for creating static, animated, and interactive visualizations. Seaborn is built on Matplotlib and provides a high-level interface for statistical graphics. Common plot types include line plots, scatter plots, bar charts, histograms, heatmaps, and box plots.',
    metadata: { topic: 'Data Science', subtopic: 'Visualization' }
  },

  // WebGPU and Browser AI
  {
    id: 'webgpu_basics',
    content: 'WebGPU is a modern web API that provides access to GPU capabilities for rendering and computation. It is the successor to WebGL and offers better performance and more features. WebGPU enables running machine learning models directly in the browser with GPU acceleration. It uses a shader language called WGSL (WebGPU Shading Language).',
    metadata: { topic: 'WebGPU', subtopic: 'Basics' }
  },
  {
    id: 'browser_ai',
    content: 'Browser-based AI runs machine learning models entirely on the client side without sending data to servers. Libraries like TensorFlow.js, ONNX Runtime Web, and Transformers.js enable this. WebLLM runs large language models in the browser using WebGPU. Benefits include privacy (data stays local), offline capability, and reduced server costs.',
    metadata: { topic: 'Browser AI', subtopic: 'Overview' }
  }
];

// Quiz questions based on the knowledge base
export const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the main difference between supervised and unsupervised learning?',
    topic: 'Machine Learning',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'What is RAG (Retrieval-Augmented Generation) and why is it useful for LLMs?',
    topic: 'LLM',
    difficulty: 'medium'
  },
  {
    id: 'q3',
    question: 'How does Python use indentation differently from other programming languages?',
    topic: 'Python',
    difficulty: 'easy'
  },
  {
    id: 'q4',
    question: 'What is the Transformer architecture and why was it revolutionary for NLP?',
    topic: 'LLM',
    difficulty: 'medium'
  },
  {
    id: 'q5',
    question: 'What are the main data structures provided by Python\'s Pandas library?',
    topic: 'Data Science',
    difficulty: 'easy'
  },
  {
    id: 'q6',
    question: 'What is WebGPU and how does it enable AI in the browser?',
    topic: 'WebGPU',
    difficulty: 'medium'
  },
  {
    id: 'q7',
    question: 'Explain the difference between lists and tuples in Python.',
    topic: 'Python',
    difficulty: 'easy'
  },
  {
    id: 'q8',
    question: 'What are CNN and RNN architectures used for in deep learning?',
    topic: 'Machine Learning',
    difficulty: 'medium'
  },
  {
    id: 'q9',
    question: 'What is prompt engineering and what are some common techniques?',
    topic: 'LLM',
    difficulty: 'medium'
  },
  {
    id: 'q10',
    question: 'What are Flexbox and Grid in CSS, and when would you use each?',
    topic: 'Web Development',
    difficulty: 'easy'
  }
];

export default { knowledgeBase, quizQuestions };
