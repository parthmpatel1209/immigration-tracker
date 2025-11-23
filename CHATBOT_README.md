# 🤖 Canadian Immigration Chatbot

## Next-Level AI Assistant with Mistral 7B + RAG

A professional Canadian immigration chatbot powered by **Mistral 7B Instruct** with **Retrieval-Augmented Generation (RAG)** for accurate, context-aware responses.

---

## ✨ Features

### 🧠 **AI-Powered**
- **Mistral 7B Instruct** via OpenRouter API
- **RAG (Retrieval-Augmented Generation)** for grounded responses
- **Streaming responses** for real-time typing effect
- **Conversation history** (sliding window of last 6 messages)

### 🎯 **Smart Interactions**
- **Dynamic suggestions** based on conversation context
- **Typing indicator** with animated dots
- **Error handling** with user-friendly messages
- **IRCC document citations** in responses

### 🎨 **Modern UI**
- **Floating chat button** (Canadian red theme)
- **Smooth animations** (fade-in, slide-up)
- **Dark mode support** throughout
- **Mobile responsive** design
- **Real-time streaming** text display

---

## 📁 File Structure

```
immigration-tracker/
├── app/api/chat/
│   └── route.ts              # API endpoint with RAG + streaming
├── components/
│   ├── ChatBot.tsx            # Main chatbot component
│   └── ChatBot.module.css     # Styles with dark mode
├── utils/
│   ├── rag.ts                 # RAG logic + IRCC knowledge base
│   └── stream.ts              # SSE streaming handler
└── .env.local                 # Environment variables
```

---

## 🚀 Setup

### 1. **Environment Variables**

Create/update `.env.local`:

```bash
# OpenRouter API Key (get from https://openrouter.ai)
OPENROUTER_API_KEY=your_api_key_here

# Optional: Specify model (default: mistral-7b-instruct:free)
OR_MODEL=mistralai/mistral-7b-instruct:free

# Optional: Site URL for OpenRouter headers
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Run Development Server**

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` - the chatbot will appear as a floating button in the bottom-right corner.

---

## 🔧 How It Works

### **1. RAG (Retrieval-Augmented Generation)**

The chatbot uses a knowledge base of IRCC documents to provide accurate answers:

```typescript
// utils/rag.ts
export async function getRelevantDocs(query: string, topK: number = 3) {
  // Searches IRCC knowledge base for relevant documents
  // Returns top K most relevant document chunks
}
```

**Current Knowledge Base Includes:**
- Express Entry & CRS scoring
- Provincial Nominee Programs (PNPs)
- Language tests (IELTS, CELPIP, PTE, TEF, TCF)
- Study permits & PGWP
- Work permits & LMIA
- Family sponsorship

### **2. Streaming Responses**

Real-time text streaming for better UX:

```typescript
// app/api/chat/route.ts
const res = await fetch(API_URL, {
  body: JSON.stringify({
    model: "mistralai/mistral-7b-instruct:free",
    stream: true, // Enable streaming
  }),
});

return streamResponse(res); // Stream to client
```

### **3. Conversation History**

Maintains context across messages:

```typescript
// Keeps last 6 messages for context
const conversationHistory = (history || []).slice(-6);
```

### **4. Dynamic Suggestions**

Suggestions update based on conversation:

```typescript
// utils/rag.ts
export function getSuggestions(lastMessage: string): string[] {
  if (lastMessage.includes("express entry")) {
    return ["How to improve CRS score?", "What are PNPs?"];
  }
  // ... context-aware suggestions
}
```

---

## 📊 API Endpoint

### **POST /api/chat**

**Request:**
```json
{
  "message": "How does Express Entry work?",
  "history": [
    { "role": "user", "text": "Previous question" },
    { "role": "bot", "text": "Previous answer" }
  ]
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"content":"Express"}
data: {"content":" Entry"}
data: {"content":" is"}
...
data: [DONE]
```

---

## 🎨 Customization

### **Update Knowledge Base**

Edit `utils/rag.ts` to add more IRCC documents:

```typescript
const IRCC_KNOWLEDGE_BASE = [
  {
    topic: "Your Topic",
    content: "Official IRCC information...",
    keywords: ["keyword1", "keyword2"],
  },
  // Add more documents
];
```

### **Change Model**

Update `.env.local`:

```bash
# Use a different model
OR_MODEL=mistralai/mistral-7b-instruct
# or
OR_MODEL=anthropic/claude-3-haiku
```

### **Adjust Streaming Parameters**

Edit `app/api/chat/route.ts`:

```typescript
{
  max_tokens: 400,      // Max response length
  temperature: 0.7,     // Creativity (0-1)
  top_p: 0.9,          // Nucleus sampling
}
```

---

## 🔮 Future Enhancements

### **Planned Features:**
- [ ] **Vector database** (Pinecone/Supabase pgvector) for better RAG
- [ ] **Embedding model** for semantic search
- [ ] **User feedback** buttons (👍/👎)
- [ ] **Conversation export** (PDF/JSON)
- [ ] **Multi-language support** (French)
- [ ] **Voice input/output**
- [ ] **Document upload** for personalized advice
- [ ] **CRS calculator integration**

### **Production Considerations:**
- [ ] Rate limiting
- [ ] User authentication
- [ ] Conversation persistence (database)
- [ ] Analytics tracking
- [ ] A/B testing
- [ ] Fine-tuning on IRCC data

---

## 📝 Notes

### **Accuracy & Disclaimers**
- Responses are based on IRCC documents but may not be 100% accurate
- Always verify with official IRCC website
- Not a replacement for licensed immigration consultants (RCICs)
- For legal advice, consult an immigration lawyer

### **API Costs**
- Using `mistral-7b-instruct:free` model (no cost)
- Paid models available for better quality
- Monitor usage at [OpenRouter Dashboard](https://openrouter.ai/dashboard)

---

## 🤝 Contributing

To improve the chatbot:

1. **Add more IRCC documents** to `utils/rag.ts`
2. **Improve suggestions** logic
3. **Enhance error handling**
4. **Add unit tests**

---

## 📄 License

This project is part of the Canadian Immigration Tracker application.

---

## 🔗 Resources

- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Mistral AI](https://mistral.ai/)
- [IRCC Official Website](https://www.canada.ca/en/immigration-refugees-citizenship.html)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Built with ❤️ for Canadian immigration applicants**
