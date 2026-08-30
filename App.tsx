import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Car,
  Check,
  ChevronRight,
  Clock3,
  DollarSign,
  Fuel as FuelIcon,
  History,
  Home as HomeIcon,
  Moon,
  Percent,
  PiggyBank,
  Search,
  Settings,
  Share2,
  ShoppingBag,
  Sun,
  Trash2,
  Wallet,
  X,
  Zap,
} from "lucide-react";

type CalcId =
  | "percentage"
  | "discount"
  | "fuel"
  | "loan"
  | "salary"
  | "profit"
  | "electricity"
  | "currency"
  | "unit"
  | "vehicle";

type Theme = "light" | "dark";

type Calc = {
  id: CalcId;
  name: string;
  description: string;
  category: string;
  icon: any;
  popular?: boolean;
};

const CALCULATORS: Calc[] = [
  {
    id: "loan",
    name: "Loan Calculator",
    description: "Estimate monthly repayments and total interest.",
    category: "Finance",
    icon: PiggyBank,
    popular: true,
  },
  {
    id: "salary",
    name: "Salary Calculator",
    description: "Estimate gross salary and take-home pay.",
    category: "Salary & Work",
    icon: Wallet,
    popular: true,
  },
  {
    id: "fuel",
    name: "Fuel Cost Calculator",
    description: "Estimate fuel usage and trip cost.",
    category: "Vehicles",
    icon: FuelIcon,
    popular: true,
  },
  {
    id: "profit",
    name: "Profit Calculator",
    description: "Calculate revenue, costs, profit and margin.",
    category: "Business",
    icon: DollarSign,
    popular: true,
  },
  {
    id: "discount",
    name: "Discount Calculator",
    description: "Find savings and final price.",
    category: "Shopping",
    icon: ShoppingBag,
    popular: true,
  },
  {
    id: "percentage",
    name: "Percentage Calculator",
    description: "Solve everyday percentage calculations.",
    category: "General",
    icon: Percent,
    popular: true,
  },
  {
    id: "electricity",
    name: "Electricity Estimator",
    description: "Estimate appliance usage and monthly cost.",
    category: "Household",
    icon: Zap,
  },
  {
    id: "currency",
    name: "Currency Converter",
    description: "Convert LKR and major currencies.",
    category: "General",
    icon: DollarSign,
  },
  {
    id: "unit",
    name: "Unit Converter",
    description: "Convert common everyday units instantly.",
    category: "General",
    icon: Calculator,
  },
  {
    id: "vehicle",
    name: "Vehicle Import Estimator",
    description: "Estimate imported vehicle landed cost.",
    category: "Vehicles",
    icon: Car,
  },
];

const CATEGORIES = [
  { name: "Finance", icon: PiggyBank },
  { name: "Vehicles", icon: Car },
  { name: "Salary & Work", icon: Wallet },
  { name: "Business", icon: DollarSign },
  { name: "Household", icon: Zap },
  { name: "Shopping", icon: ShoppingBag },
  { name: "General", icon: Calculator },
];

const money = (n: number) =>
  `Rs. ${Math.round(n).toLocaleString("en-LK")}`;

function num(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function saveHistory(name: string, result: string) {
  try {
    const existing = JSON.parse(
      localStorage.getItem("lankacalc-history") || "[]"
    );

    const item = {
      id: Date.now(),
      name,
      result,
      date: new Date().toISOString(),
    };

    localStorage.setItem(
      "lankacalc-history",
      JSON.stringify([item, ...existing].slice(0, 50))
    );
  } catch {}
}

async function shareText(text: string) {
  try {
    if (navigator.share) {
      await navigator.share({
        title: "LankaCalc Result",
        text,
      });
    } else {
      await navigator.clipboard.writeText(text);
      window.alert("Result copied to clipboard!");
    }
  } catch {}
}

function Input({
  label,
  value,
  setValue,
  suffix,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  suffix?: string;
}) {
  return (
    <label className="lc-input">
      <span>{label}</span>
      <div>
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) =>
            setValue(e.target.value.replace(/[^\d.-]/g, ""))
          }
        />
        {suffix && <small>{suffix}</small>}
      </div>
    </label>
  );
}

function Result({
  label,
  value,
  main,
}: {
  label: string;
  value: string;
  main?: boolean;
}) {
  return (
    <div className={`lc-result ${main ? "main" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ShareButton({
  text,
  name,
  result,
}: {
  text: string;
  name: string;
  result: string;
}) {
  return (
    <button
      className="lc-share"
      onClick={() => {
        saveHistory(name, result);
        shareText(text);
      }}
    >
      <Share2 size={17} />
      Share Result
    </button>
  );
}

function Percentage() {
  const [p, setP] = useState("10");
  const [amount, setAmount] = useState("5000");

  const result = (num(p) / 100) * num(amount);

  return (
    <CalcPage
      title="Percentage Calculator"
      description="Calculate a percentage of any amount instantly."
      icon={Percent}
      disclaimer="Mathematical calculation only."
    >
      <Input label="Percentage" value={p} setValue={setP} suffix="%" />
      <Input label="Amount" value={amount} setValue={setAmount} suffix="LKR" />
      <Result label="Result" value={money(result)} main />

      <div className="lc-formula">
        {p}% × {money(num(amount))} = {money(result)}
      </div>

      <ShareButton
        name="Percentage calculation"
        result={money(result)}
        text={`🔥 LankaCalc Result

${p}% of ${money(num(amount))} = ${money(result)}

Calculate smarter. Live better. 🇱🇰`}
      />
    </CalcPage>
  );
}

function Discount() {
  const [price, setPrice] = useState("10000");
  const [discount, setDiscount] = useState("10");

  const validDiscount = Math.min(100, Math.max(0, num(discount)));
  const saved = (num(price) * validDiscount) / 100;
  const final = Math.max(0, num(price) - saved);

  return (
    <CalcPage
      title="Discount Calculator"
      description="Find the final price and how much you save."
      icon={ShoppingBag}
      disclaimer="Final checkout prices can differ when other charges apply."
    >
      <Input
        label="Original price"
        value={price}
        setValue={setPrice}
        suffix="LKR"
      />

      <Input
        label="Discount"
        value={discount}
        setValue={setDiscount}
        suffix="%"
      />

      <div className="lc-results">
        <Result label="You save" value={money(saved)} />
        <Result label="Final price" value={money(final)} main />
      </div>

      <ShareButton
        name="Discount calculation"
        result={money(final)}
        text={`🔥 LankaCalc Result

Original price: ${money(num(price))}
Discount: ${validDiscount}%
Final price: ${money(final)}
You save: ${money(saved)}

🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function FuelCalculator() {
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("15");
  const [price, setPrice] = useState("300");
  const [roundTrip, setRoundTrip] = useState(false);

  const km = Math.max(0, num(distance)) * (roundTrip ? 2 : 1);
  const eff = Math.max(0.01, num(efficiency));
  const litres = km / eff;
  const cost = litres * Math.max(0, num(price));

  return (
    <CalcPage
      title="Fuel Cost Calculator"
      description="Estimate fuel usage and trip cost."
      icon={FuelIcon}
      disclaimer="Fuel prices and real-world vehicle efficiency can change."
    >
      <Input
        label="Distance"
        value={distance}
        setValue={setDistance}
        suffix="km"
      />

      <Input
        label="Vehicle efficiency"
        value={efficiency}
        setValue={setEfficiency}
        suffix="km/L"
      />

      <Input
        label="Fuel price"
        value={price}
        setValue={setPrice}
        suffix="LKR/L"
      />

      <button
        className={`lc-toggle ${roundTrip ? "active" : ""}`}
        onClick={() => setRoundTrip(!roundTrip)}
      >
        {roundTrip && <Check size={15} />}
        {roundTrip ? "Round trip" : "One way"}
      </button>

      <div className="lc-results">
        <Result label="Fuel required" value={`${litres.toFixed(2)} L`} />
        <Result label="Estimated cost" value={money(cost)} main />
      </div>

      <ShareButton
        name="Fuel trip"
        result={money(cost)}
        text={`🔥 LankaCalc Fuel Result

Distance: ${km} km
Fuel: ${litres.toFixed(2)} L
Estimated cost: ${money(cost)}

🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Loan() {
  const [amount, setAmount] = useState("5000000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");

  const principal = Math.max(0, num(amount));
  const months = Math.max(1, Math.round(num(years) * 12));
  const annualRate = Math.max(0, num(rate));
  const monthlyRate = annualRate / 1200;

  const payment =
    monthlyRate === 0
      ? principal / months
      : (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const total = payment * months;
  const interest = Math.max(0, total - principal);

  return (
    <CalcPage
      title="Loan Calculator"
      description="Estimate monthly repayments and total loan cost."
      icon={PiggyBank}
      disclaimer="Actual lender repayment may differ due to fees, insurance and lender-specific terms."
    >
      <Input
        label="Loan amount"
        value={amount}
        setValue={setAmount}
        suffix="LKR"
      />

      <Input
        label="Annual interest rate"
        value={rate}
        setValue={setRate}
        suffix="%"
      />

      <Input
        label="Loan period"
        value={years}
        setValue={setYears}
        suffix="years"
      />

      <Result label="Monthly payment" value={money(payment)} main />

      <div className="lc-results">
        <Result label="Total repayment" value={money(total)} />
        <Result label="Total interest" value={money(interest)} />
      </div>

      <div className="lc-formula">
        Standard reducing-balance EMI formula.
      </div>

      <ShareButton
        name="Loan calculation"
        result={money(payment)}
        text={`🔥 LankaCalc Loan Result

Loan amount: ${money(principal)}
Monthly payment: ${money(payment)}
Total interest: ${money(interest)}

🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Salary() {
  const [basic, setBasic] = useState("100000");
  const [allowance, setAllowance] = useState("20000");
  const [overtime, setOvertime] = useState("5000");
  const [deduction, setDeduction] = useState("0");

  const gross =
    Math.max(0, num(basic)) +
    Math.max(0, num(allowance)) +
    Math.max(0, num(overtime));

  const deductions = Math.max(0, num(deduction));
  const takeHome = Math.max(0, gross - deductions);

  return (
    <CalcPage
      title="Salary Calculator"
      description="Estimate gross salary and take-home pay."
      icon={Wallet}
      disclaimer="Deduction and tax assumptions can change. Verify current official rates."
    >
      <Input
        label="Basic salary"
        value={basic}
        setValue={setBasic}
        suffix="LKR"
      />

      <Input
        label="Allowances"
        value={allowance}
        setValue={setAllowance}
        suffix="LKR"
      />

      <Input
        label="Overtime"
        value={overtime}
        setValue={setOvertime}
        suffix="LKR"
      />

      <Input
        label="Other deductions"
        value={deduction}
        setValue={setDeduction}
        suffix="LKR"
      />

      <div className="lc-results">
        <Result label="Gross salary" value={money(gross)} />
        <Result label="Deductions" value={money(deductions)} />
        <Result
          label="Estimated take-home"
          value={money(takeHome)}
          main
        />
      </div>

      <div className="lc-assumption">
        <b>Rates used</b>
        <span>No automatic EPF/ETF/tax rate is assumed in V1.</span>
      </div>

      <ShareButton
        name="Salary calculation"
        result={money(takeHome)}
        text={`🔥 LankaCalc Salary Result

Gross: ${money(gross)}
Deductions: ${money(deductions)}
Estimated take-home: ${money(takeHome)}

🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Profit() {
  const [selling, setSelling] = useState("1000");
  const [cost, setCost] = useState("700");
  const [quantity, setQuantity] = useState("100");
  const [expenses, setExpenses] = useState("0");

  const revenue =
    Math.max(0, num(selling)) * Math.max(0, num(quantity));

  const productCost =
    Math.max(0, num(cost)) * Math.max(0, num(quantity));

  const otherExpenses = Math.max(0, num(expenses));
  const totalCost = productCost + otherExpenses;
  const profit = revenue - totalCost;
  const margin = revenue ? (profit / revenue) * 100 : 0;
  const markup = productCost ? (profit / productCost) * 100 : 0;

  return (
    <CalcPage
      title="Business Profit Calculator"
      description="Calculate revenue, costs, profit, margin and markup."
      icon={DollarSign}
      disclaimer="Use actual accounting costs for important business decisions."
    >
      <Input
        label="Selling price / unit"
        value={selling}
        setValue={setSelling}
        suffix="LKR"
      />

      <Input
        label="Cost price / unit"
        value={cost}
        setValue={setCost}
        suffix="LKR"
      />

      <Input
        label="Quantity"
        value={quantity}
        setValue={setQuantity}
      />

      <Input
        label="Other expenses"
        value={expenses}
        setValue={setExpenses}
        suffix="LKR"
      />

      <div className="lc-results">
        <Result label="Revenue" value={money(revenue)} />
        <Result label="Total cost" value={money(totalCost)} />
        <Result label="Net profit" value={money(profit)} main />
        <Result label="Profit margin" value={`${margin.toFixed(2)}%`} />
        <Result label="Markup" value={`${markup.toFixed(2)}%`} />
      </div>

      <ShareButton
        name="Business profit"
        result={money(profit)}
        text={`🔥 LankaCalc Profit Result

Revenue: ${money(revenue)}
Cost: ${money(totalCost)}
Profit: ${money(profit)}
Margin: ${margin.toFixed(2)}%

🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Electricity() {
  const [watts, setWatts] = useState("100");
  const [quantity, setQuantity] = useState("2");
  const [hours, setHours] = useState("8");
  const [days, setDays] = useState("30");
  const [rate, setRate] = useState("50");

  const kwh =
    (Math.max(0, num(watts)) *
      Math.max(0, num(quantity)) *
      Math.max(0, num(hours)) *
      Math.max(0, num(days))) /
    1000;

  const cost = kwh * Math.max(0, num(rate));

  return (
    <CalcPage
      title="Electricity Estimator"
      description="Estimate monthly appliance electricity usage."
      icon={Zap}
      disclaimer="This is an estimate. Actual electricity bills depend on the applicable tariff structure and billing rules."
    >
      <Input
        label="Appliance wattage"
        value={watts}
        setValue={setWatts}
        suffix="W"
      />

      <Input
        label="Quantity"
        value={quantity}
        setValue={setQuantity}
      />

      <Input
        label="Hours per day"
        value={hours}
        setValue={setHours}
        suffix="hours"
      />

      <Input
        label="Days per month"
        value={days}
        setValue={setDays}
        suffix="days"
      />

      <Input
        label="Estimated rate"
        value={rate}
        setValue={setRate}
        suffix="LKR/kWh"
      />

      <div className="lc-results">
        <Result label="Estimated usage" value={`${kwh.toFixed(2)} kWh`} />
        <Result
          label="Estimated monthly cost"
          value={money(cost)}
          main
        />
      </div>

      <div className="lc-assumption">
        <b>Tariff assumption</b>
        <span>
          Simple configurable rate used for estimation: Rs. {rate}/kWh.
        </span>
      </div>

      <ShareButton
        name="Electricity estimate"
        result={money(cost)}
        text={`🔥 LankaCalc Electricity Estimate

Usage: ${kwh.toFixed(2)} kWh
Estimated cost: ${money(cost)}

🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Currency() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("LKR");

  const rates: Record<string, number> = {
    LKR: 1,
    USD: 300,
    EUR: 350,
    GBP: 405,
    AUD: 195,
    CAD: 220,
    JPY: 2,
    INR: 3.6,
    AED: 82,
    SAR: 80,
    SGD: 235,
  };

  const lkr = num(amount) * rates[from];
  const result = lkr / rates[to];

  return (
    <CalcPage
      title="Currency Converter"
      description="Convert LKR and major currencies using indicative rates."
      icon={DollarSign}
      disclaimer="Indicative rates only. Exchange rates change continuously and may differ from bank or exchange-house rates."
    >
      <Input
        label="Amount"
        value={amount}
        setValue={setAmount}
      />

      <label className="lc-input">
        <span>From</span>

        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        >
          {Object.keys(rates).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <button
        className="lc-swap"
        onClick={() => {
          setFrom(to);
          setTo(from);
        }}
      >
        ↕ Swap currencies
      </button>

      <label className="lc-input">
        <span>To</span>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
        >
          {Object.keys(rates).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <Result
        label="Converted amount"
        value={`${result.toFixed(2)} ${to}`}
        main
      />

      <div className="lc-rate">
        Indicative rate: 1 {from} ≈{" "}
        {(rates[from] / rates[to]).toFixed(4)} {to}
      </div>

      <ShareButton
        name="Currency conversion"
        result={`${result.toFixed(2)} ${to}`}
        text={`🔥 LankaCalc Currency Result

${amount} ${from} ≈ ${result.toFixed(2)} ${to}

Indicative rate
🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Unit() {
  const [value, setValue] = useState("10");
  const [from, setFrom] = useState("km");
  const [to, setTo] = useState("m");

  const factors: Record<string, number> = {
    km: 1000,
    m: 1,
    cm: 0.01,
    mm: 0.001,
    miles: 1609.344,
    ft: 0.3048,
    inches: 0.0254,
    kg: 1,
    g: 0.001,
    lb: 0.45359237,
    oz: 0.0283495,
  };

  const result =
    factors[from] && factors[to]
      ? (num(value) * factors[from]) / factors[to]
      : 0;

  return (
    <CalcPage
      title="Unit Converter"
      description="Convert common length and weight units instantly."
      icon={Calculator}
      disclaimer="Conversion uses standard mathematical conversion factors."
    >
      <Input
        label="Value"
        value={value}
        setValue={setValue}
      />

      <label className="lc-input">
        <span>From</span>

        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        >
          {Object.keys(factors).map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </label>

      <label className="lc-input">
        <span>To</span>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
        >
          {Object.keys(factors).map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </label>

      <Result
        label="Converted value"
        value={`${result.toFixed(4)} ${to}`}
        main
      />
    </CalcPage>
  );
}

function Vehicle() {
  const [price, setPrice] = useState("5000000");
  const [shipping, setShipping] = useState("500000");
  const [insurance, setInsurance] = useState("100000");
  const [taxRate, setTaxRate] = useState("100");
  const [other, setOther] = useState("100000");

  const purchase = Math.max(0, num(price));

  const base =
    purchase +
    Math.max(0, num(shipping)) +
    Math.max(0, num(insurance));

  const tax =
    (base * Math.max(0, num(taxRate))) / 100;

  const total =
    base +
    tax +
    Math.max(0, num(other));

  return (
    <CalcPage
      title="Vehicle Import Estimator"
      description="Estimate an imported vehicle's landed cost."
      icon={Car}
      disclaimer="ESTIMATE ONLY. Import duties, taxes, levies, exchange rates and applicable charges can change. This is not an official government calculation."
    >
      <div className="lc-estimate-badge">
        ESTIMATE ONLY
      </div>

      <Input
        label="Vehicle purchase price"
        value={price}
        setValue={setPrice}
        suffix="LKR"
      />

      <Input
        label="Shipping cost"
        value={shipping}
        setValue={setShipping}
        suffix="LKR"
      />

      <Input
        label="Insurance"
        value={insurance}
        setValue={setInsurance}
        suffix="LKR"
      />

      <Input
        label="Estimated tax / duty rate"
        value={taxRate}
        setValue={setTaxRate}
        suffix="%"
      />

      <Input
        label="Other charges"
        value={other}
        setValue={setOther}
        suffix="LKR"
      />

      <div className="lc-results">
        <Result
          label="Vehicle + shipping + insurance"
          value={money(base)}
        />

        <Result
          label="Estimated taxes / duties"
          value={money(tax)}
        />

        <Result
          label="Other charges"
          value={money(num(other))}
        />

        <Result
          label="Estimated landed cost"
          value={money(total)}
          main
        />
      </div>

      <ShareButton
        name="Vehicle import estimate"
        result={money(total)}
        text={`🔥 LankaCalc Vehicle Import Estimate

Estimated landed cost: ${money(total)}

ESTIMATE ONLY 🇱🇰`}
      />
    </CalcPage>
  );
}

function CalcPage({
  title,
  description,
  icon: Icon,
  disclaimer,
  children,
}: {
  title: string;
  description: string;
  icon: any;
  disclaimer: string;
  children: React.ReactNode;
}) {
  return (
    <main className="lc-page">
      <div className="lc-page-inner">
        <button
          className="lc-back"
          onClick={() => (location.hash = "")}
        >
          <ArrowLeft size={16} />
          Calculators
        </button>

        <div className="lc-calc-header">
          <div className="lc-big-icon">
            <Icon size={25} />
          </div>

          <div>
            <span className="lc-kicker">
              LANKACALC
            </span>

            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>

        <section className="lc-calculator">
          <div className="lc-form">
            {children}
          </div>

          <details className="lc-how">
            <summary>
              How this calculation works
            </summary>

            <p>
              LankaCalc processes your inputs in your
              browser and displays the result instantly.
              Basic calculations do not require a
              database.
            </p>
          </details>

          <div className="lc-disclaimer">
            ⚠️ {disclaimer}
          </div>
        </section>

        <div className="lc-ad">
          <span>ADVERTISEMENT</span>
        </div>
      </div>
    </main>
  );
}

function Home({
  openCalc,
  setPage,
}: {
  openCalc: (id: CalcId) => void;
  setPage: (p: string) => void;
}) {
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      return CALCULATORS.filter((c) => c.popular);
    }

    return CALCULATORS.filter((c) =>
      `${c.name} ${c.description} ${c.category}`
        .toLowerCase()
        .includes(q)
    );
  }, [search]);

  return (
    <main>
      <section className="lc-hero">
        <div className="lc-hero-inner">
          <div className="lc-badge">
            🇱🇰 Made for Sri Lanka
          </div>

          <h1>
            Sri Lanka's
            <br />
            <span>Smart Calculator Hub.</span>
          </h1>

          <p>
            Calculate loans, salaries, fuel costs,
            profits, discounts and more — instantly.
          </p>

          <div className="lc-search">
            <Search size={20} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search a calculator..."
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="lc-quick">
            {[
              ["Loan", "loan"],
              ["Fuel", "fuel"],
              ["Salary", "salary"],
              ["Discount", "discount"],
            ].map(([name, id]) => (
              <button
                key={id}
                onClick={() =>
                  openCalc(id as CalcId)
                }
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="lc-section">
        <div className="lc-section-title">
          <div>
            <span className="lc-kicker">
              POPULAR
            </span>

            <h2>
              What do you need to calculate?
            </h2>
          </div>

          <button
            onClick={() =>
              setPage("calculators")
            }
          >
            View all
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="lc-grid">
          {results.map((calc) => {
            const Icon = calc.icon;

            return (
              <button
                className="lc-card"
                key={calc.id}
                onClick={() =>
                  openCalc(calc.id)
                }
              >
                <div className="lc-card-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <h3>{calc.name}</h3>
                  <p>{calc.description}</p>
                  <small>{calc.category}</small>
                </div>

                <ChevronRight
                  className="lc-chevron"
                  size={18}
                />
              </button>
            );
          })}
        </div>
      </section>

      <section className="lc-section">
        <div className="lc-section-title">
          <div>
            <span className="lc-kicker">
              EXPLORE
            </span>

            <h2>
              Calculator categories
            </h2>
          </div>
        </div>

        <div className="lc-category-grid">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;

            return (
              <button
                className="lc-category"
                key={category.name}
                onClick={() =>
                  setPage("calculators")
                }
              >
                <Icon size={19} />
                <span>{category.name}</span>
                <ChevronRight size={15} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="lc-trust">
        <div>
          <b>Fast & private</b>
          <span>
            Your calculations happen locally in
            your browser.
          </span>
        </div>

        <div>
          <b>Made for Sri Lanka</b>
          <span>
            LKR-first tools for everyday decisions.
          </span>
        </div>

        <div>
          <b>Transparent</b>
          <span>
            Assumptions and estimates are clearly
            labelled.
          </span>
        </div>
      </section>

      <div className="lc-ad">
        <span>ADVERTISEMENT</span>
      </div>
    </main>
  );
}

function Calculators({
  openCalc,
}: {
  openCalc: (id: CalcId) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = CALCULATORS.filter((c) =>
    `${c.name} ${c.category} ${c.description}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main className="lc-page">
      <div className="lc-page-inner">
        <div className="lc-list-head">
          <span className="lc-kicker">
            LANKACALC
          </span>

          <h1>All calculators</h1>

          <p>
            Fast, simple tools built for everyday
            Sri Lankan needs.
          </p>
        </div>

        <div className="lc-search lc-inner-search">
          <Search size={19} />

          <input
            placeholder="Search calculators..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
          />
        </div>

        <div className="lc-grid">
          {filtered.map((calc) => {
            const Icon = calc.icon;

            return (
              <button
                className="lc-card"
                key={calc.id}
                onClick={() =>
                  openCalc(calc.id)
                }
              >
                <div className="lc-card-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <h3>{calc.name}</h3>
                  <p>{calc.description}</p>
                  <small>{calc.category}</small>
                </div>

                <ChevronRight
                  className="lc-chevron"
                  size={18}
                />
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function HistoryPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      setItems(
        JSON.parse(
          localStorage.getItem(
            "lankacalc-history"
          ) || "[]"
        )
      );
    } catch {
      setItems([]);
    }
  }, []);

  function clear() {
    localStorage.removeItem(
      "lankacalc-history"
    );

    setItems([]);
  }

  return (
    <main className="lc-page">
      <div className="lc-page-inner">
        <div className="lc-list-head">
          <span className="lc-kicker">
            LOCAL STORAGE
          </span>

          <h1>History</h1>

          <p>
            Saved locally on this device.
          </p>
        </div>

        {items.length > 0 && (
          <button
            className="lc-clear"
            onClick={clear}
          >
            <Trash2 size={16} />
            Clear history
          </button>
        )}

        {items.length === 0 ? (
          <div className="lc-empty">
            <History size={30} />

            <h3>
              No calculations yet
            </h3>

            <p>
              Use Share Result on a calculator
              to save a result here.
            </p>
          </div>
        ) : (
          <div className="lc-history">
            {items.map((item) => (
              <div
                className="lc-history-item"
                key={item.id}
              >
                <div>
                  <b>{item.name}</b>

                  <small>
                    {new Date(
                      item.date
                    ).toLocaleString()}
                  </small>
                </div>

                <strong>
                  {item.result}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SettingsPage({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) {
  return (
    <main className="lc-page">
      <div className="lc-page-inner">
        <div className="lc-list-head">
          <span className="lc-kicker">
            PREFERENCES
          </span>

          <h1>Settings</h1>

          <p>
            Customize your LankaCalc experience.
          </p>
        </div>

        <section className="lc-settings">
          <div className="lc-setting">
            <div>
              <b>Appearance</b>

              <small>
                Choose your preferred theme.
              </small>
            </div>

            <div className="lc-theme-buttons">
              <button
                className={
                  theme === "light"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTheme("light")
                }
              >
                <Sun size={16} />
                Light
              </button>

              <button
                className={
                  theme === "dark"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTheme("dark")
                }
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>

          <div className="lc-setting">
            <div>
              <b>Currency</b>

              <small>
                Default currency for LankaCalc.
              </small>
            </div>

            <strong>
              LKR / Rs.
            </strong>
          </div>

          <div className="lc-setting">
            <div>
              <b>Country</b>

              <small>
                Default country.
              </small>
            </div>

            <strong>
              🇱🇰 Sri Lanka
            </strong>
          </div>

          <div className="lc-setting">
            <div>
              <b>Privacy</b>

              <small>
                Your calculations are
                processed locally.
              </small>
            </div>

            <Check size={19} />
          </div>

          <div className="lc-setting">
            <div>
              <b>Premium</b>

              <small>
                Future no-ads and advanced
                features.
              </small>
            </div>

            <span className="lc-coming">
              Coming later
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

function App() {
  const [page, setPage] = useState(
    location.hash.replace("#", "") ||
      "home"
  );

  const [theme, setTheme] =
    useState<Theme>(
      (localStorage.getItem(
        "lankacalc-theme"
      ) as Theme) || "light"
    );

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      "lankacalc-theme",
      theme
    );
  }, [theme]);

  useEffect(() => {
    const listener = () =>
      setPage(
        location.hash.replace(
          "#",
          ""
        ) || "home"
      );

    window.addEventListener(
      "hashchange",
      listener
    );

    return () =>
      window.removeEventListener(
        "hashchange",
        listener
      );
  }, []);

  function navigate(value: string) {
    location.hash = value;

    setPage(value);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openCalc(id: CalcId) {
    navigate(id);
  }

  let content: React.ReactNode;

  switch (page) {
    case "calculators":
      content = (
        <Calculators
          openCalc={openCalc}
        />
      );
      break;

    case "history":
      content = <HistoryPage />;
      break;

    case "settings":
      content = (
        <SettingsPage
          theme={theme}
          setTheme={setTheme}
        />
      );
      break;

    case "percentage":
      content = <Percentage />;
      break;

    case "discount":
      content = <Discount />;
      break;

    case "fuel":
      content = <FuelCalculator />;
      break;

    case "loan":
      content = <Loan />;
      break;

    case "salary":
      content = <Salary />;
      break;

    case "profit":
      content = <Profit />;
      break;

    case "electricity":
      content = <Electricity />;
      break;

    case "currency":
      content = <Currency />;
      break;

    case "unit":
      content = <Unit />;
      break;

    case "vehicle":
      content = <Vehicle />;
      break;

    default:
      content = (
        <Home
          openCalc={openCalc}
          setPage={navigate}
        />
      );
  }

  return (
    <div className="lankacalc">
      <header className="lc-header">
        <button
          className="lc-brand"
          onClick={() =>
            navigate("home")
          }
        >
          <span className="lc-logo">
            <Calculator size={20} />
          </span>

          <span>
            LankaCalc

            <small>
              Calculate smarter. Live
              better. 🇱🇰
            </small>
          </span>
        </button>

        <nav className="lc-desktop-nav">
          <button
            onClick={() =>
              navigate("home")
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              navigate("calculators")
            }
          >
            Calculators
          </button>

          <button
            onClick={() =>
              navigate("history")
            }
          >
            History
          </button>

          <button
            onClick={() =>
              navigate("settings")
            }
          >
            Settings
          </button>
        </nav>

        <button
          className="lc-header-theme"
          onClick={() =>
            setTheme(
              theme === "light"
                ? "dark"
                : "light"
            )
          }
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </button>
      </header>

      {content}

      <footer className="lc-footer">
        <div>
          <b>LankaCalc 🇱🇰</b>

          <p>
            Simple calculators made for
            Sri Lanka.
          </p>
        </div>

        <span>
          Estimates & general calculations.
          Verify official rates where
          applicable.
        </span>
      </footer>

      <nav className="lc-bottom-nav">
        <button
          className={
            page === "home"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("home")
          }
        >
          <HomeIcon size={18} />
          Home
        </button>

        <button
          className={
            page === "calculators"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("calculators")
          }
        >
          <Calculator size={18} />
          Calculators
        </button>

        <button
          className={
            page === "history"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("history")
          }
        >
          <Clock3 size={18} />
          History
        </button>

        <button
          className={
            page === "settings"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("settings")
          }
        >
          <Settings size={18} />
          Settings
        </button>
      </nav>
    </div>
  );
}

export default App;
