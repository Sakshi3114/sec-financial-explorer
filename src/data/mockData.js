export const MOCK_SEARCH_RESULTS = [
  { name: "Apple Inc.", ticker: "AAPL", cik: "0000320193" },
  { name: "Applied Materials", ticker: "AMAT", cik: "0000796343" },
  { name: "Applied DNA Sciences", ticker: "APDN", cik: "0001060349" },
];

export const MOCK_COMPANY = {
  cik: "0000320193",
  name: "Apple Inc.",
  ticker: "AAPL",
  sic: "3674",
  sicDescription: "Semiconductors & Related Devices",
  stateOfIncorporation: "CA",
  exchanges: ["Nasdaq"],
  fiscalYearEnd: "0930",
  filingCount: 423,
};

const mkSeries = (base, growth, years = 8) =>
  Array.from({ length: years }, (_, i) => {
    const year = 2016 + i;
    const value = Math.round(base * Math.pow(1 + growth, i));
    return { date: `${year}-09-30`, value, form: "10-K" };
  });

export const MOCK_METRICS = {
  revenue: {
    series: mkSeries(215_639_000_000, 0.08),
    latest: { date: "2023-09-30", value: 383_285_000_000 },
    growth: 2.8,
  },
  netIncome: {
    series: mkSeries(45_687_000_000, 0.1),
    latest: { date: "2023-09-30", value: 96_995_000_000 },
    growth: -2.8,
  },
  totalAssets: {
    series: mkSeries(321_686_000_000, 0.06),
    latest: { date: "2023-09-30", value: 352_583_000_000 },
    growth: -0.7,
  },
  totalLiabilities: {
    series: mkSeries(241_272_000_000, 0.05),
    latest: { date: "2023-09-30", value: 290_437_000_000 },
    growth: 0.5,
  },
  equity: {
    series: mkSeries(80_414_000_000, -0.04),
    latest: { date: "2023-09-30", value: 62_146_000_000 },
    growth: -8.0,
  },
  operatingIncome: {
    series: mkSeries(60_024_000_000, 0.09),
    latest: { date: "2023-09-30", value: 114_301_000_000 },
    growth: -0.3,
  },
  eps: {
    series: mkSeries(2.97, 0.14),
    latest: { date: "2023-09-30", value: 6.13 },
    growth: 13.0,
  },
  cash: {
    series: mkSeries(20_289_000_000, 0.03),
    latest: { date: "2023-09-30", value: 29_965_000_000 },
    growth: -16.0,
  },
};

export const MOCK_POPULAR_SEARCH = [
  { name: "Apple Inc.", ticker: "AAPL", cik: "0000320193" },
  { name: "Microsoft Corp.", ticker: "MSFT", cik: "0000789019" },
  { name: "Amazon.com Inc.", ticker: "AMZN", cik: "0001018724" },
];
