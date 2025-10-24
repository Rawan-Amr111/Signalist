# Signalist 📈

Signalist is an intelligent stock tracking and market analysis platform. It provides users with real-time stock data from Finnhub, the latest financial news, and AI-powered insights using Google's Gemini AI.
[LIVE DEMO] (https://signalist-lime.vercel.app/)
NOTE: use your real google email to see the email sent to you

## 🚀 Key Features

* **Real-time Stock Tracking:** Get live price updates for stocks using the Finnhub API.
* **Personalized Watchlist:** Users can create an account to add, remove, and monitor their favorite stocks in a personal watchlist (using `WatchlistButton` and `WatchlistTable`).
* **In-Depth Analysis:** View detailed company information, financials, and historical data for any stock (in the `StockDetails` view).
* **Interactive Charts:** Visualize market trends with rich, interactive charts provided by TradingView.
* **Latest Market News:** Stay informed with the latest financial news relevant to specific stocks or the market in general.
* **AI-Powered Insights:** Utilizes the Gemini AI to provide summaries, analyze market sentiment, or generate reports.
* **Email Notifications:** Leverages Nodemailer to send alerts or reports directly to users' inboxes.

## 🛠️ Tech Stack

* **Frontend:** React, Next.js
* **Backend:** Next.js (API Routes)
* **Database:** MongoDB
* **Data & APIs:**
    * **Stock Data:** Finnhub API
    * **AI:** Google Gemini AI
    * **Charts:** TradingView Widgets
* **Services:**
    * **Email:** Nodemailer
    * **Analytics:** Vercel Analytics

## Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### Prerequisites

You must have [Node.js](https://nodejs.org/) (which includes npm) and [Git](https://git-scm.com/) installed on your machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/Rawan-Amr111/Signalist.git](https://github.com/Rawan-Amr111/Signalist.git)
cd Signalist
```
### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables
This project relies on several external APIs and a database.
Create a file named .env.local in the root of your project and add the following variables. You will need to get your own API keys from each respective service.
```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Finnhub API
FINNHUB_API_KEY=your_finnhub_api_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Nodemailer (for sending emails)
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=465
NODEMAILER_USER=your_email@gmail.com
NODEMAILER_PASS=your_gmail_app_password
```
### 4. Run the Development Server
Once your environment variables are set, you can start the application.

```bash
npm run dev
```
### 🚀 Deployment
The easiest way to deploy this Next.js application is using Vercel.
Make sure to add your environment variables from .env.local to the Vercel project settings.
