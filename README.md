# Luma Sight: Universal Knowledge Engine

**Luma Sight** is an advanced multimodal scientific research engine built for the **Google Gemma for Good Hackathon**. It empowers users to transform visual inputs and complex questions into comprehensive, cited research briefings using the state-of-the-art **Gemma 3** model.

## 🚀 Key Features

- **Gemma 3 Multimodal Identification:** Upload an image (medicine, hazard signs, artifacts) and Luma Sight Vision automatically identifies the object and triggers a targeted research fan-out.
- **Fan-Out Retrieval Engine:** Consults 9+ global knowledge sources in parallel, including PubMed, NASA APOD, Wikipedia, World Bank, and more.
- **SDG Alignment:** Automatically maps research findings to **UN Sustainable Development Goals** to measure social impact.
- **Hallucination-Proof Transparency:** "Live Verification" tooltips show the raw data snippets from scientific APIs for every key finding.
- **Academic Utility Suite:** One-click generation of Presentation Outlines, Essay Drafts, Quizzes, and Citations (APA/MLA/Harvard).
- **Multilingual Impact:** Instantly translate research into Spanish, French, Chinese, Arabic, or Hindi.

## 🛠️ Built With

- **AI Model:** Google Gemma 3 (gemma-3-27b-it)
- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Visuals:** Lucide Icons, Shadcn UI
- **APIs:** Wikipedia, PubMed, NASA, Open Meteo, REST Countries, World Bank, NewsAPI

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API Key (with Gemma 3 access)

### Installation

1. Clone the repository
2. Navigate to the `app/` directory:
   ```bash
   cd app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the `app/` directory and add your API key:
   ```env
   VITE_GEMMA_API_KEY=your_api_key_here
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🌍 Social Impact

Luma Sight is designed to bridge the information gap by providing technical research in accessible formats (Simple/Standard/Technical levels). By aligning with the UN SDGs, we ensure that every search contributes to global knowledge sharing and informed decision-making.

---

Built by **Mercury** · Powered by **Google Gemma 3**
