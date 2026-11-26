# Sources — Why a $400,000 house costs over $860,000

- Freddie Mac Primary Mortgage Market Survey, via AP/WCAX, "The average US 30-year mortgage rate falls to 7.18% this week" (Nov 5, 2026) — 30-year fixed average = 7.18%. https://www.wcax.com/2026/11/05/average-us-30-year-mortgage-rate-falls-718-this-week-its-third-straight-decline/ (series: https://fred.stlouisfed.org/series/MORTGAGE30US)
- National Association of Realtors, "Home prices rise in 78% of metro areas, Q3 2026" — national median single-family existing-home price $432,900 (so a $400,000 house is a typical home). https://www.nar.realtor/newsroom/home-prices-rise-78-percent-metro-areas-q3-2026
- Wells Fargo, "What is mortgage amortization?" — fixed payment; early payments go mostly to interest, later mostly to principal. https://www.wellsfargo.com/mortgage/learn/amortization/
- The Mortgage Reports, "How mortgage amortization works" — interest is charged on the remaining balance; extra principal payments cut total interest; refinancing into a new 30-year restarts the schedule. https://themortgagereports.com/73349/how-mortgage-loan-amortization-works

## Our math (standard amortization formula, computed in node)
$400,000 house, 20% down ($80,000), $320,000 loan, 30-year fixed at 7.18%:
- Monthly principal + interest: $2,167.79
- Month 1: $1,914.67 interest (88%), $253.12 principal
- After 10 years (120 payments ≈ $260,000 paid): balance still $275,751
- Total of 360 payments: $780,405 → total interest $460,405
- Total cost incl. down payment: $860,405 (excludes property tax, insurance, PMI)
- Extra $200/month toward principal: paid off in ~23.2 years, total interest $336,316 (saves ~$124,000)
