# 🧠 Browser RAG Quiz

A 100% browser-based RAG (Retrieval-Augmented Generation) quiz application. Run AI models directly in your browser — no server required!

[![Transformers.js](https://img.shields.io/badge/Transformers.js-Powered-orange?style=for-the-badge)](https://huggingface.co/docs/transformers.js)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![100% Client-Side](https://img.shields.io/badge/100%25-Client--Side-blue?style=for-the-badge)]()

## ✨ Features

- 🔒 **100% Client-Side** — All processing happens in your browser. No data leaves your device.
- 🚀 **No WebGPU Required** — Uses WASM for broad browser compatibility
- 🔍 **Real RAG Pipeline** — Embeds documents, retrieves context, and augments LLM responses
- 🧠 **Smart Evaluation** — LLM validates answers using retrieved context
- 💾 **Model Caching** — Models are cached locally after first download
- 📱 **Responsive Design** — Works on desktop and mobile
- 🎨 **Dark Theme** — Easy on the eyes

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                             │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │ Flan-T5     │    │Transformers │    │  In-Memory  │ │
│  │ (Text Gen)  │    │    .js      │    │  Vector     │ │
│  │             │    │ (Embeddings)│    │   Store     │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘         │
│                            │                            │
│                   ┌────────▼────────┐                   │
│                   │   Quiz Engine   │                   │
│                   │  - RAG Retrieval│                   │
│                   │  - LLM Grading  │                   │
│                   │  - Scoring      │                   │
│                   └─────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Any modern browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/micrometre/web-rag-quiz
cd web-rag-quiz

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## 🤖 Supported LLM Models

All LLM models are powered by [Transformers.js](https://huggingface.co/docs/transformers.js), running entirely in the browser using ONNX runtime (WASM).

| Model | Model ID | Size | Notes |
|-------|----------|------|-------|
| Flan-T5 Small | `Xenova/flan-t5-small` | ~250MB | **Fastest** - Great for quick responses |
| Flan-T5 Base | `Xenova/flan-t5-base` | ~500MB | Better quality responses |
| LaMini Flan-T5 | `Xenova/LaMini-Flan-T5-248M` | ~250MB | Instruction-tuned variant |

### About Flan-T5

Flan-T5 is a text-to-text model by Google that excels at:
- Question answering
- Text summarization
- Instruction following
- Classification tasks

### Adding More Models

You can add any text2text-generation model from [Hugging Face](https://huggingface.co/models?pipeline_tag=text2text-generation&library=transformers.js). Simply add the model ID to the dropdown in `index.html`.

## 🔧 How It Works

1. **Embedding Model Loads** — Transformers.js loads `all-MiniLM-L6-v2` for text embeddings
2. **Knowledge Base Indexed** — Educational documents are embedded and stored in a vector store
3. **LLM Loads** — Transformers.js loads Flan-T5 for text generation
4. **Quiz Begins** — For each question:
   - Relevant context is retrieved from the knowledge base (RAG)
   - You answer the question
   - The LLM evaluates your answer using the retrieved context
   - You receive personalized feedback
5. **Results** — The LLM generates a personalized summary of your performance

## 📚 Knowledge Base Topics

The built-in knowledge base covers:
- Python Programming
- Machine Learning & Deep Learning
- Large Language Models (LLMs)
- RAG & Prompt Engineering
- Web Development (HTML, CSS, JavaScript)
- Data Science (Pandas, NumPy)
- Browser AI

You can easily extend the knowledge base by editing `src/knowledgeBase.js`.

## 📦 Dependencies

### Core AI Library

| Package | Purpose | Runtime |
|---------|---------|--------|
| [@huggingface/transformers](https://github.com/huggingface/transformers.js) | Embeddings & Text Generation | WASM |

### Transformers.js Details

Transformers.js enables running AI models natively in the browser:
- **ONNX Runtime**: Uses WebAssembly for broad compatibility
- **Model Caching**: Models are cached in browser storage after first download
- **Hugging Face Hub**: Access thousands of pre-converted models
- **No Server Required**: All computation happens client-side

```javascript
// Example Transformers.js usage in this project
import { pipeline } from '@huggingface/transformers';

// Text generation with Flan-T5
const generator = await pipeline('text2text-generation', 'Xenova/flan-t5-small');
const result = await generator('Translate to French: Hello, how are you?');

// Text embeddings
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const embeddings = await embedder('Some text to embed');
```

### Build Tools

- [Vite](https://vitejs.dev/) — Fast build tool and dev server

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

## 🧪 Tested Environment

- **OS:** Ubuntu 24.04 LTS
- **Browser:** Chrome, Firefox, Edge
- **Model:** Flan-T5 Small

## 🌐 Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome | ✅ Supported |
| Firefox | ✅ Supported |
| Edge | ✅ Supported |
| Safari | ✅ Supported |

## 📄 License

MIT License — feel free to use this project for any purpose.


## 🔗 Useful Links

- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [Flan-T5 Models on Hugging Face](https://huggingface.co/models?search=flan-t5)
- [Xenova ONNX Models](https://huggingface.co/Xenova)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)

---

Made with ️ using [Transformers.js](https://github.com/huggingface/transformers.js)
