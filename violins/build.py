"""
Build PPP Instruments LLC — Charlotte Substrate Visualization
Parses Excel data and generates a single-file HTML dashboard.
"""
import json, math, re

# ─── INSTRUMENT TURN DATA (historical trades) ─────────────────────────────
turn_data = []

# Violins
violins_raw = [
    (1, None, None, "2023", "2.8M", "4M"),
    (2, "2018", "15k", "2025-02-03", "20k", "22k"),
    (3, "2000", "21.7k", "2023-02-15", "24k", "27k"),
    (4, "2018", "250k", "2022", "330k", "380k"),
    (5, "2015", "180k", None, None, "270k"),
    (6, "2012", "4M", "2022", "10M", "12M"),
    (7, "2023", "19.4k", "2023-01-18", "25k", "28k"),
    (8, "2020", "18k", "2024-12-05", "20k", "22k"),
    (9, "2019", "55k", "2022", "68k", "95k"),
    (10, "2018", "45k", "2024-11-09", "75k", "78k"),
    (11, "2022", "35k", "2025-12-24", "55k", "55k"),
    (12, "2019", "14k", "2024-06-14", "18k", "22k"),
    (13, "2015", "280k", "2025-04-25", "380k", "475k"),
    (14, "2005", "150k", "2022-04-01", "330k", "375k"),
    (15, "2012", "2.5M", "2023", "4.8M", "6.5M"),
    (16, "2010", "4M", "2019", "10M", "13.5M"),
    (17, "2010", "5M", "2020", "12M", "13M"),
    (18, "2001", "98k", "2025-01-25", "275k", "335k"),
]

violas_raw = [
    (1, None, None, "2023", "37k", "48k"),
]

cellos_raw = [
    (1, None, None, "2025-02-01", "205k", "275k"),
    (2, "2015", "90k", "2022", "146k", "175k"),
]

violin_bows_raw = [
    (1, "2018", "7k", "2025-02-01", "10k", "12k"),
    (2, "2020", "35k", "2024-05-20", "45k", "47k"),
    (3, "2023", "15.2k", "2024-05-02", "24k", "26k"),
    (4, "2019", "28k", "2023", "40k", "55k"),
    (5, None, None, "2022-01-22", "65k", "85k"),
    (6, "2019", "12k", "2025-12-24", "18k", "20k"),
    (7, "2018", "14k", "2024-12-07", "18k", "20k"),
    (8, "2019", "22k", "2025-12-24", "25k", "25k"),
]

viola_bows_raw = [
    (1, "2020", "15k", "2023", "19k", "28k"),
]

cello_bows_raw = [
    (1, None, None, "2023", "45k", "55k"),
    (2, None, None, "2023", "18k", "25k"),
]

def parse_price(s):
    """Convert price strings like '4M', '250k', '15k' to float dollars."""
    if s is None:
        return None
    s = str(s).strip().replace(',', '').replace('$', '')
    if not s:
        return None
    s_lower = s.lower()
    if 'm' in s_lower:
        return float(s_lower.replace('m', '')) * 1_000_000
    elif 'k' in s_lower:
        return float(s_lower.replace('k', '')) * 1_000
    else:
        try:
            return float(s)
        except:
            return None

def parse_year(s):
    if s is None:
        return None
    s = str(s).strip()
    if len(s) >= 4:
        try:
            return int(s[:4])
        except:
            return None
    return None

def build_turn_instruments(raw, category, subcategory=None):
    items = []
    for num, buy_date, buy_price, sell_date, sell_price, val_2025 in raw:
        bp = parse_price(buy_price)
        sp = parse_price(sell_price)
        v25 = parse_price(val_2025)
        by = parse_year(buy_date)
        sy = parse_year(sell_date)

        appreciation = None
        if bp and v25:
            appreciation = round((v25 - bp) / bp * 100, 1)
        elif bp and sp:
            appreciation = round((sp - bp) / bp * 100, 1)

        annual_return = None
        if bp and v25 and by:
            years = 2025 - by
            if years > 0:
                annual_return = round(((v25 / bp) ** (1.0 / years) - 1) * 100, 1)

        items.append({
            "id": f"turn-{category.lower()}-{num}",
            "name": f"{category} #{num}",
            "category": category,
            "subcategory": subcategory or category,
            "buy_year": by,
            "buy_price": bp,
            "sell_year": sy,
            "sell_price": sp,
            "value_2025": v25,
            "appreciation_pct": appreciation,
            "annual_return_pct": annual_return,
            "source": "turn_data"
        })
    return items

turn_data.extend(build_turn_instruments(violins_raw, "Violin"))
turn_data.extend(build_turn_instruments(violas_raw, "Viola"))
turn_data.extend(build_turn_instruments(cellos_raw, "Cello"))
turn_data.extend(build_turn_instruments(violin_bows_raw, "Bow", "Violin Bow"))
turn_data.extend(build_turn_instruments(viola_bows_raw, "Bow", "Viola Bow"))
turn_data.extend(build_turn_instruments(cello_bows_raw, "Bow", "Cello Bow"))

# ─── PORTFOLIO DATA (current holdings & sold) ─────────────────────────────
portfolio = []

sold_raw = [
    ("Kloz c. 1780", 19400, 25000, 24400, 5000, 0.289, 18, 5.23, "pill"),
    ("B. M Dolling Bow #1", 3600, 5000, 4650, 1050, 0.389, 26, 4.09, "pill"),
    ("B. M Dolling Bow #2", 3600, 5000, 4380, 780, 0.389, 77, 1.03, "pill"),
    ("Benoit Rolland Bow", 15200, 20000, 20325, 5125, 0.316, 740, 0.17, "pill"),
    ("W. Salchow Bow", 8750, 11000, 11200, 2450, 0.257, 298, 0.34, "pill"),
    ("G. Kagan Bow", 3650, 5000, 5600, 1950, 0.370, 23, 8.48, "pill"),
    ("Gaillard Violin", 21000, 24000, 24000, 3000, 0.143, 7, 7.45, "pill"),
]

for name, purchase, retail, sold_price, profit, disc, days, annual, owner in sold_raw:
    cat = "Bow" if "bow" in name.lower() else "Violin" if "violin" in name.lower() else "Violin"
    portfolio.append({
        "id": f"sold-{name.lower().replace(' ', '-')[:20]}",
        "name": name,
        "category": cat,
        "status": "sold",
        "owner": owner,
        "purchase_price": purchase,
        "retail_value": retail,
        "sold_price": sold_price,
        "profit": profit,
        "discount_pct": round(disc * 100, 1),
        "days_held": days,
        "annual_return_pct": round(annual, 1),
        "source": "portfolio"
    })

hold_raw = [
    ("Peter Paul Prier Viola", 37000, 48000, 0.297, "pill", "Viola"),
    ("Pedrazzini 1945", 68000, 85000, 0.250, "pill", "Violin"),
    ("A. Lamy Viola Bow", 19000, 28000, 0.474, "pill", "Bow"),
    ("E. A Ouchard Cello Bow", 45000, 55000, 0.222, "pill", "Bow"),
    ("Bernard Ouchard Cello Bow", 18000, 22000, 0.222, "pill", "Bow"),
    ("A. Suard Violin Bow #1", 8760, 12000, 0.370, "pill", "Bow"),
    ("A. Suard Violin Bow #2", 8760, 12000, 0.370, "pill", "Bow"),
    ("John N. Lee Bow", 5110, 7000, 0.370, "pill", "Bow"),
    ("Soffritti Cello", 205000, 275000, 0.341, "pill", "Cello"),
]

for name, purchase, retail, disc, owner, cat in hold_raw:
    equity = retail - purchase
    portfolio.append({
        "id": f"hold-{name.lower().replace(' ', '-')[:20]}",
        "name": name,
        "category": cat,
        "status": "hold",
        "owner": owner,
        "purchase_price": purchase,
        "retail_value": retail,
        "instant_equity": equity,
        "discount_pct": round(disc * 100, 1),
        "source": "portfolio"
    })

emily_raw = [
    ("Steiner 1662", 360000, 450000, "Violin", "2022-08-04"),
    ("Ponormo", 69000, 95000, "Violin", "2021-07-01"),
    ("Peccatte Bow", 123000, 185000, "Bow", "2023-08-17"),
    ("Grancino Violin 1703", 300000, 450000, "Violin", "2023-03-17"),
]

for name, purchase, retail, cat, date in emily_raw:
    equity = retail - purchase
    disc = round((equity / retail) * 100, 1) if retail else 0
    portfolio.append({
        "id": f"emily-{name.lower().replace(' ', '-')[:20]}",
        "name": name,
        "category": cat,
        "status": "hold",
        "owner": "emily",
        "purchase_price": purchase,
        "retail_value": retail,
        "instant_equity": equity,
        "discount_pct": disc,
        "purchase_date": date,
        "source": "portfolio"
    })

# PPP Owned
portfolio.append({
    "id": "ppp-amati-1657",
    "name": "Amati 1657",
    "category": "Violin",
    "status": "hold",
    "owner": "ppp",
    "purchase_price": 2500000,
    "retail_value": 3500000,
    "instant_equity": 1000000,
    "discount_pct": 40.0,
    "source": "portfolio"
})

# ─── HISTORICAL APPRECIATION (from business plan) ──────────────────────────
historical = [
    {"name": "Glennie Strad 1704", "year_bought": 1971, "price_bought": 68000, "year_valued": 2021, "price_valued": 12000000},
    {"name": "Huberman Strad 1713", "year_bought": 1936, "price_bought": 28000, "year_valued": 2001, "price_valued": 4000000},
    {"name": "Kreisler del Gesu 1733", "year_bought": 2000, "price_bought": 900000, "year_valued": 2010, "price_valued": 3500000},
    {"name": "Vieuxtemps del Gesu 1741", "year_bought": 2012, "price_bought": 16000000, "year_valued": 2025, "price_valued": 22000000},
]

for h in historical:
    years = h["year_valued"] - h["year_bought"]
    if years > 0 and h["price_bought"] > 0:
        h["annual_return_pct"] = round(((h["price_valued"] / h["price_bought"]) ** (1.0 / years) - 1) * 100, 1)
        h["total_return_pct"] = round((h["price_valued"] - h["price_bought"]) / h["price_bought"] * 100, 1)
    else:
        h["annual_return_pct"] = 0
        h["total_return_pct"] = 0

# ─── SUMMARY STATS ─────────────────────────────────────────────────────────
total_purchase = sum(p.get("purchase_price", 0) for p in portfolio)
total_retail = sum(p.get("retail_value", 0) for p in portfolio)
total_equity = total_retail - total_purchase
total_sold_profit = sum(p.get("profit", 0) for p in portfolio if p["status"] == "sold")
num_sold = len([p for p in portfolio if p["status"] == "sold"])
num_hold = len([p for p in portfolio if p["status"] == "hold"])
total_instruments = len(portfolio)

# Turn data stats
turn_total_instruments = len(turn_data)
turn_with_buy = [t for t in turn_data if t["buy_price"]]
turn_with_appreciation = [t for t in turn_data if t["appreciation_pct"] is not None]
avg_appreciation = round(sum(t["appreciation_pct"] for t in turn_with_appreciation) / len(turn_with_appreciation), 1) if turn_with_appreciation else 0
max_appreciation_item = max(turn_with_appreciation, key=lambda t: t["appreciation_pct"]) if turn_with_appreciation else None

# Highest value instruments
all_valued = [(t["name"], t["value_2025"]) for t in turn_data if t["value_2025"]] + \
             [(p["name"], p["retail_value"]) for p in portfolio if p.get("retail_value")]
all_valued.sort(key=lambda x: x[1], reverse=True)

summary = {
    "total_purchase": total_purchase,
    "total_retail": total_retail,
    "total_equity": total_equity,
    "avg_discount_pct": round(total_equity / total_retail * 100, 1) if total_retail else 0,
    "total_sold_profit": total_sold_profit,
    "num_sold": num_sold,
    "num_hold": num_hold,
    "total_portfolio_instruments": total_instruments,
    "turn_total_instruments": turn_total_instruments,
    "avg_appreciation_pct": avg_appreciation,
    "highest_value": all_valued[0] if all_valued else None,
    "top_5_values": all_valued[:5],
}

data = {
    "summary": summary,
    "turn_data": turn_data,
    "portfolio": portfolio,
    "historical": historical,
    "company": {
        "name": "PPP Instruments LLC",
        "location": "Burley, Idaho",
        "ceo": "Dr. Brek A. Pilling, Ph.D.",
        "vp_certs": "Paul Stewart Prier",
        "vp_sales": "Chris Johnson",
        "target_fund": 100000000,
        "model": "Buy rare string instruments at 15-35% below retail, hold for appreciation, sell at market"
    }
}

# Write JSON
with open("C:/dev/violins/violin_data.json", "w") as f:
    json.dump(data, f, indent=2)

print(f"Generated violin_data.json")
print(f"Portfolio: {total_instruments} instruments, ${total_purchase:,.0f} purchase, ${total_retail:,.0f} retail")
print(f"Turn data: {turn_total_instruments} instruments tracked")
print(f"Avg appreciation: {avg_appreciation}%")
print(f"Top value: {all_valued[0][0]} at ${all_valued[0][1]:,.0f}" if all_valued else "")
