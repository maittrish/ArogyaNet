# ArogyaNet: Medical AI Platform 🏥🚀

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Deploy-success?style=for-the-badge&logo=vercel)](https://medical-ai-platform-nu.vercel.app)
[![Google AI Hackathon](https://img.shields.io/badge/Google_AI-Community_Edition_Hackathon-blue?style=for-the-badge&logo=google)](https://medical-ai-platform-nu.vercel.app)

**ArogyaNet** is a federated AI platform engineered for national-scale health resource and supply chain management. Designed to address persistent vulnerabilities in India's public healthcare system, this platform provides real-time visibility into medicine stocks, bed availability, and medical personnel attendance across the Primary Health Centre (PHC) network.

**🌐 Live Demo:** [https://medical-ai-platform-nu.vercel.app](https://medical-ai-platform-nu.vercel.app)

---

## 📖 The Problem
Public healthcare systems across India face severe supply chain vulnerabilities. The inability to track medicines, patient footfall, and resource utilization in real-time leads to localized stock-outs. This limits the country's capacity to respond rapidly during medical emergencies, seasonal disease outbreaks, and routine care operations.

## 💡 The Solution
ArogyaNet leverages Google AI to create a resilient, scalable, and decentralized intelligence network. By integrating predictive modeling, autonomous agent reasoning, and multimodal inputs, the platform ensures no PHC falls below critical operational thresholds.

### ✨ Core Features
*   **Predictive Early Warning System:** Forecasts demand and generates automated alerts for potential stock-outs up to 14 days in advance using historical consumption and footfall data.
*   **Autonomous Resource Redistribution:** Calculates optimal, automated cross-district transfer manifests when a facility faces an imminent shortage, using geospatial routing to find the closest surplus hub.
*   **Multimodal Ledger Digitization:** Frontline workers can simply take a photo of handwritten stock registers or pharmacy batch strips; our Gemini Multimodal integration parses this unstructured image into validated JSON data.
*   **Voice-First Vernacular Reporting:** Integrated Cloud Speech-to-Text and Translation allows grassroots workers (like ANMs) to log inventory updates securely using regional language voice commands.
*   **Federated Dashboard:** A responsive, real-time command center mapping all local PHCs, their active bed counts, and logistics routes.

---

## 🛠️ Technology Stack

*   **Generative AI & Autonomous Agents:** Gemini 1.5 Pro / Flash (via Google AI Studio)
*   **Predictive Modelling:** Vertex AI 
*   **Computer Vision / OCR:** Gemini 1.5 Flash Multimodal
*   **Voice & Translation:** Google Cloud Speech-to-Text, Translation API
*   **Geospatial & Logistics:** Google Maps Platform (Routes & Distance Matrix API)
*   **Backend & Telemetry:** Google Cloud Platform, Firebase Firestore
*   **Frontend Hosting:** Vercel (React/Vite)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Google Cloud Console Account
*   Google AI Studio API Key

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/medical-ai-platform.git](https://github.com/your-username/medical-ai-platform.git)
   cd medical-ai-platform
   Install dependencies:

2.**Install Dependencies**
Bash
npm install

3.**Environment Variables:**
Create a .env.local file in the root directory and add your API keys:
VITE_GEMINI_API_KEY=your_google_ai_studio_key
VITE_FIREBASE_CONFIG=your_firebase_config_object
VITE_MAPS_API_KEY=your_google_maps_key

4.**Run**
npm run dev


Team Details
This project was conceptualized, designed, and engineered by:

Maittrish Sen Sharma

Soham Banik

Arya Das

Ranojoy Chatterjee
