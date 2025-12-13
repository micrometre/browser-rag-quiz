# 🧠 Browser RAG Quiz: AI Learning in Your Browser

## Introduction

**Browser RAG Quiz** is a 100% client-side, privacy-first quiz application that lets you learn and test your knowledge of AI, programming, and data science topics—all powered by real AI models running directly in your browser. No server, no data sharing, no installation required.

- **Live Demo:** [browser-rag-quiz.vercel.app](https://browser-rag-quiz.vercel.app/)
- **Source Code:** [github.com/micrometre/browser-rag-quiz](https://github.com/micrometre/browser-rag-quiz)

---

## ✨ Key Features

- 🔒 **Privacy First:** All computation happens locally. Your data never leaves your device.
- 🚀 **No Server Required:** Powered by [Transformers.js](https://huggingface.co/docs/transformers.js) and ONNX Runtime (WASM).
- 🧠 **Real RAG Pipeline:** Embeds documents, retrieves context, and augments LLM responses for each quiz question.
- 💾 **Model Caching:** Models are cached in your browser after first download for fast, offline use.
- 📱 **Responsive & Accessible:** Works on desktop and mobile, with a dark theme for comfort.

---

## 🏗️ How It Works: Under the Hood

This application demonstrates a **100% client-side RAG (Retrieval-Augmented Generation)** architecture. Unlike traditional RAG apps that rely on Python/LangChain servers, this runs entirely in your browser using WebAssembly.

### 1. The Technology Stack
- **[Transformers.js](https://huggingface.co/docs/transformers.js/index):** The core engine that runs Hugging Face models in JavaScript. It uses **ONNX Runtime** to execute models efficiently in the browser (via WASM).
- **WebLLM:** (Optional/Alternative) Used for larger chat models, leveraging WebGPU for hardware acceleration.
- **In-Memory Vector Store:** A custom-built, lightweight vector database that runs in main memory.

### 2. The Educational RAG Pipeline

Here is exactly what happens when you press "Submit":

1.  **Read & Chunk:** The educational content (knowledge base) is split into manageable text chunks.
2.  **Embed (Indexing):** We use the `Xenova/all-MiniLM-L6-v2` model to convert every chunk of text into a 384-dimensional vector (array of numbers). This happens locally during initialization.
3.  **Vector Search:** When a question is asked:
    *   The question is converted into a vector.
    *   We calculate the **Cosine Similarity** between the question vector and all knowledge vectors.
    *   The top 3 most similar chunks are retrieved as "Context".
4.  **Augmented Generation:** We construct a prompt that looks like this:
    ```
    Context: [Content from Source A] ... [Content from Source B]
    
    Question: What are the three states of matter?
    Student Answer: The three states are solid, liquid and gas.
    
    Grade this answer as correct or incorrect and explain why in one sentence:
    ```
5.  **Evaluation:** The local LLM (e.g., `Flan-T5-Small`) processes this prompt and generates the feedback (e.g., "Correct! You accurately identified the three primary states...").

### 3. Architecture Diagram

```mermaid
graph TD
    A[User Answer] --> B(Browser Main Thread)
    K[Educational Content] --> C{Embedding Model<br/>all-MiniLM-L6-v2}
    C --> D[Vector Store<br/>(In-Memory Arrays)]
    B --> E{LLM Service<br/>Flan-T5 / LaMini}
    D -- Retrieved Context --> E
    E -- Feedback --> F[UI Display]
    
    style C fill:#f9f,stroke:#333
    style E fill:#bbf,stroke:#333
    style D fill:#dfd,stroke:#333
```

---

## 📚 Knowledge Base Topics

Test your knowledge across these domains:

- 🐍 **Python Programming:** Syntax, data types, functions, and more
- 🤖 **Machine Learning:** Supervised, unsupervised, and neural networks
- 💬 **Large Language Models:** Transformers, RAG, and prompt engineering
- 🌐 **Web Development:** HTML, CSS, JavaScript, and Web APIs
- 📊 **Data Science:** Pandas, NumPy, and visualization
- ⚡ **Browser AI:** WebGPU, client-side ML, and WASM

---

## 🤖 Supported LLM Models

All models run entirely in your browser using ONNX Runtime (WASM):

| Model              | Size    | Notes                                 |
|--------------------|---------|---------------------------------------|
| Flan-T5 Small      | ~250MB  | ⚡ Fastest - Great for quick responses |
| Flan-T5 Base       | ~500MB  | ✨ Better quality responses            |
| LaMini Flan-T5     | ~250MB  | 📝 Instruction-tuned variant          |

---

## 🚀 Getting Started

1. **Open the app:** [browser-rag-quiz.vercel.app](https://browser-rag-quiz.vercel.app/)
2. **Select a model** and click "Initialize Models & Start Quiz"
3. **Answer questions**—the AI will grade your answers and provide feedback
4. **Review your results** and get a personalized summary

---

## 🔧 Under the Hood

- **Embeddings:** Uses `all-MiniLM-L6-v2` for text embeddings
- **LLM:** Uses Flan-T5 or LaMini Flan-T5 for text generation and answer evaluation
- **Vector Store:** In-memory, fast, and private
- **Framework:** Built with [Vite](https://vitejs.dev/) for instant loading

---

## 📦 Tech Stack

- [@huggingface/transformers.js](https://github.com/huggingface/transformers.js) — Embeddings & Text Generation (WASM)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) — Model execution in browser
- [Vite](https://vitejs.dev/) — Build tool and dev server

---

## 🗂️ Project Structure

```
browser-rag-quiz/
├── index.html              # Main HTML with quiz UI
├── src/
│   ├── main.js             # Quiz application logic
│   ├── embeddingService.js # Transformers.js embeddings
│   ├── vectorStore.js      # In-memory vector database
│   ├── llmService.js       # Transformers.js Flan-T5 wrapper
│   ├── knowledgeBase.js    # Quiz content & questions
│   └── styles.css          # Dark theme styling
├── package.json            # Dependencies
└── vite.config.js          # Vite config with CORS headers
```

---

## 📄 License

MIT License — free for any use.

---

## 🔗 Useful Links

- [Live App](https://browser-rag-quiz.vercel.app/)
- [Source Code](https://github.com/micrometre/browser-rag-quiz)
- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [Flan-T5 Models on Hugging Face](https://huggingface.co/models?search=flan-t5)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)

---

*Made with ❤️ using open-source AI and Transformers.js*
