export type BookResource = {
  kind: "book";
  title: string;
  author: string;
  description: string;
};

export type CourseResource = {
  kind: "course";
  title: string;
  provider: string;
  url: string;
  description: string;
};

export type ReportResource = {
  kind: "report";
  title: string;
  provider: string;
  url?: string;
  description: string;
};

export type ToolResource = {
  kind: "tool";
  title: string;
  url: string;
  description: string;
};

export type ResourceItem = BookResource | CourseResource | ReportResource | ToolResource;

export type ResourceSection = {
  category: string;
  items: ResourceItem[];
};

export const resources: ResourceSection[] = [
  {
    category: "Books",
    items: [
      { kind: "book", title: "The Intelligent Investor", author: "Benjamin Graham", description: "The definitive book on value investing — essential reading for any finance enthusiast." },
      { kind: "book", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", description: "What the rich teach their kids about money that the poor and middle class do not." },
      { kind: "book", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", description: "Understanding behavioral economics and how two systems drive decision making." },
      { kind: "book", title: "Zero to One", author: "Peter Thiel", description: "Notes on startups and how to build the future — from PayPal co-founder Peter Thiel." },
      { kind: "book", title: "The Psychology of Money", author: "Morgan Housel", description: "Timeless lessons on wealth, greed, and happiness from 19 short stories." }
    ]
  },
  {
    category: "Courses",
    items: [
      { kind: "course", title: "SEBI Investor Education", provider: "SEBI", url: "https://investor.sebi.gov.in", description: "Official resources for investor awareness from India's securities regulator." },
      { kind: "course", title: "NPTEL Finance Courses", provider: "IITs/IISc", url: "https://nptel.ac.in", description: "Advanced academic courses on financial management from India's premier institutes." },
      { kind: "course", title: "Financial Markets", provider: "Yale University (Coursera)", url: "https://www.coursera.org/learn/financial-markets-global", description: "Comprehensive overview of financial systems taught by Robert Shiller." }
    ]
  },
  {
    category: "Reports",
    items: [
      { kind: "report", title: "RBI Annual Report", provider: "Reserve Bank of India", url: "https://www.rbi.org.in", description: "Macroeconomic analysis and monetary policy review of the Indian economy." },
      { kind: "report", title: "NABARD Annual Report", provider: "NABARD", url: "https://www.nabard.org", description: "Insights into rural credit, agricultural finance, and development banking in India." },
      { kind: "report", title: "Economic Survey of India", provider: "Ministry of Finance", url: "https://www.indiabudget.gov.in", description: "The flagship annual document covering India's economic performance and outlook." }
    ]
  },
  {
    category: "Tools",
    items: [
      { kind: "tool", title: "Screener.in", url: "https://www.screener.in", description: "Free stock screening and in-depth financial analysis tool for Indian markets." },
      { kind: "tool", title: "Moneycontrol", url: "https://www.moneycontrol.com", description: "India's leading financial platform for markets, news, and personal finance." },
      { kind: "tool", title: "TradingView", url: "https://www.tradingview.com", description: "Advanced charting, technical analysis, and a social network for traders worldwide." },
      { kind: "tool", title: "ET Markets", url: "https://economictimes.indiatimes.com/markets", description: "Market data, economic indicators, and financial news from the Economic Times." }
    ]
  }
];
