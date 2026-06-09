// ═══════════════════════════════════════════════════════════════════════════
//  BIST SCAN · TradingView Scanner Proxy (Netlify Function)
//  Alan listesi index.html'deki TV_FIELDS ile BİREBİR AYNI sırada olmalı.
//  index.html isim-bazlı okuduğu için fields dizisini de geri gönderiyoruz.
// ═══════════════════════════════════════════════════════════════════════════
const FIELDS = [
  "name",
  "description",
  "sector",
  "industry",
  "close",
  "change",
  "Recommend.All",
  "Recommend.MA",
  "Recommend.Other",
  "RSI",
  "RSI[1]",
  "Mom",
  "CCI20",
  "MACD.macd",
  "MACD.signal",
  "Stoch.K",
  "Stoch.D",
  "ADX",
  "ADX+DI",
  "ADX-DI",
  "AO",
  "Aroon.Up",
  "Aroon.Down",
  "ATR",
  "Volatility.D",
  "Volatility.W",
  "SMA20",
  "SMA50",
  "SMA100",
  "SMA200",
  "EMA20",
  "EMA50",
  "EMA200",
  "VWMA",
  "BB.upper",
  "BB.lower",
  "BB.basis",
  "price_52_week_high",
  "price_52_week_low",
  "High.52W",
  "Low.52W",
  "Perf.W",
  "Perf.1M",
  "Perf.3M",
  "Perf.6M",
  "Perf.Y",
  "Perf.YTD",
  "Perf.5Y",
  "price_earnings_ttm",
  "price_book_ratio",
  "price_sales_ratio",
  "price_free_cash_flow_ttm",
  "enterprise_value_ebitda_ttm",
  "earnings_per_share_diluted_ttm",
  "dividends_yield_current",
  "dividend_payout_ratio_ttm",
  "market_cap_basic",
  "total_shares_outstanding_fundamental",
  "float_shares_outstanding",
  "volume",
  "average_volume_10d_calc",
  "average_volume_30d_calc",
  "relative_volume_10d_calc",
  "return_on_equity",
  "return_on_assets",
  "return_on_invested_capital",
  "gross_margin",
  "operating_margin",
  "net_margin",
  "ebitda_margin",
  "free_cash_flow_margin_ttm",
  "debt_to_equity",
  "current_ratio",
  "quick_ratio",
  "total_debt",
  "total_assets",
  "cash_n_short_term_invest",
  "total_revenue_ttm",
  "net_income_ttm",
  "free_cash_flow_ttm",
  "ebitda_ttm",
  "revenue_per_employee",
  "beta_1_year",
  "number_of_employees",
  "Price to Book",
  "price_to_sales_ratio",
  "price_free_cash_flow",
  "enterprise_value_to_ebitda",
  "earnings_per_share_basic_ttm",
  "total_revenue",
  "net_income",
  "free_cash_flow",
  "ebitda",
  "earnings_per_share_ttm"
];
 
exports.handler = async function() {
  const body = {
    filter: [{ left: "exchange", operation: "equal", right: "BIST" }],
    options: { lang: "tr" },
    markets: ["turkey"],
    symbols: { query: { types: ["stock"] } },
    columns: FIELDS,
    sort: { sortBy: "market_cap_basic", sortOrder: "desc" },
    range: [0, 750]
  };
  try {
    const r = await fetch("https://scanner.tradingview.com/turkey/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://tr.tradingview.com",
        "Referer": "https://tr.tradingview.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000)
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error("TradingView " + r.status + ": " + t.slice(0,120));
    }
    const data = await r.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ fields: FIELDS, totalCount: data.totalCount, data: data.data })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
 
