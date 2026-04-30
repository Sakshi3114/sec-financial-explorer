export const SEC_BASE_URL = "/sec-api";
export const EFTS_BASE_URL = "/efts-api";

export const POPULAR_COMPANIES = [
  { name: "Apple Inc.", ticker: "AAPL", cik: "0000320193" },
  { name: "Microsoft Corp.", ticker: "MSFT", cik: "0000789019" },
  { name: "Amazon.com Inc.", ticker: "AMZN", cik: "0001018724" },
  { name: "Alphabet Inc.", ticker: "GOOGL", cik: "0001652044" },
  { name: "Meta Platforms", ticker: "META", cik: "0001326801" },
  { name: "Tesla Inc.", ticker: "TSLA", cik: "0001318605" },
  { name: "NVIDIA Corp.", ticker: "NVDA", cik: "0001045810" },
  { name: "Berkshire Hathaway", ticker: "BRK", cik: "0001067983" },
  { name: "JPMorgan Chase", ticker: "JPM", cik: "0000019617" },
  { name: "Johnson & Johnson", ticker: "JNJ", cik: "0000200406" },
  { name: "Visa Inc.", ticker: "V", cik: "0001403161" },
  { name: "Walmart Inc.", ticker: "WMT", cik: "0000104169" },
  { name: "Exxon Mobil", ticker: "XOM", cik: "0000034088" },
  { name: "Netflix Inc.", ticker: "NFLX", cik: "0001065280" },
  { name: "UnitedHealth Group", ticker: "UNH", cik: "0000731766" },
];

export const METRIC_DEFS = {
  revenue: {
    label: "Revenue",
    tags: [
      "Revenues",
      "RevenueFromContractWithCustomerExcludingAssessedTax",
      "SalesRevenueNet",
    ],
    color: "#00C896",
    format: "currency",
    icon: "📈",
    description: "Total revenue from operations",
  },
  netIncome: {
    label: "Net Income",
    tags: ["NetIncomeLoss", "ProfitLoss"],
    color: "#22C55E",
    format: "currency",
    icon: "💰",
    description: "Net income after all expenses & taxes",
  },
  totalAssets: {
    label: "Total Assets",
    tags: ["Assets"],
    color: "#3D6BFF",
    format: "currency",
    icon: "🏦",
    description: "Total assets on the balance sheet",
  },
  totalLiabilities: {
    label: "Total Liabilities",
    tags: ["Liabilities"],
    color: "#F43F5E",
    format: "currency",
    icon: "📉",
    description: "Total liabilities owed",
  },
  equity: {
    label: "Stockholders' Equity",
    tags: [
      "StockholdersEquity",
      "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest",
    ],
    color: "#F59E0B",
    format: "currency",
    icon: "⚖️",
    description: "Shareholders' equity",
  },
  operatingIncome: {
    label: "Operating Income",
    tags: ["OperatingIncomeLoss"],
    color: "#7A90B0",
    format: "currency",
    icon: "⚙️",
    description: "Income from core business operations",
  },
  eps: {
    label: "EPS (Diluted)",
    tags: ["EarningsPerShareDiluted"],
    color: "#00C896",
    format: "decimal",
    icon: "📊",
    description: "Earnings per diluted share",
  },
  cash: {
    label: "Cash & Equivalents",
    tags: [
      "CashAndCashEquivalentsAtCarryingValue",
      "CashCashEquivalentsAndShortTermInvestments",
    ],
    color: "#22C55E",
    format: "currency",
    icon: "💵",
    description: "Cash & short-term investments",
  },
};

export const CHART_COLORS = [
  "#00C896",
  "#3D6BFF",
  "#F59E0B",
  "#22C55E",
  "#F43F5E",
  "#7A90B0",
  "#a855f7",
  "#ec4899",
];
export const TABS = [
  { key: "overview", label: "Overview" },
  { key: "charts", label: "Charts" },
  { key: "table", label: "Data Table" },
];
