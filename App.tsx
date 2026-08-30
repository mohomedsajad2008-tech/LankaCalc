import { useMemo, useState } from "react";
import {
  Calculator,
  Car,
  Clock3,
  Fuel,
  Home,
  Menu,
  Percent,
  PiggyBank,
  Search,
  Settings,
  Share2,
  Wallet,
  X
} from "lucide-react";

type CalculatorId =
  | "percentage"
  | "discount"
  | "fuel"
  | "loan"
  | "salary"
  | "profit";

type CalculatorItem = {
  id: CalculatorId;
  name: string;
  description: string;
  category: string;
  icon: typeof Calculator;
};

const calculators: CalculatorItem[] = [
  {
    id: "percentage",
    name: "Percentage Calculator",
    description: "Calculate percentages quickly",
    category: "General",
    icon: Percent
  },
  {
    id: "discount",
    name: "Discount Calculator",
    description: "Find your savings and final price",
    category: "Shopping",
    icon: Percent
  },
  {
    id: "fuel",
    name: "Fuel Cost Calculator",
    description: "Estimate fuel needed and trip cost",
    category: "Vehicles",
    icon: Fuel
  },
  {
    id: "loan",
    name: "Loan / EMI Calculator",
    description: "Estimate monthly loan repayments",
    category: "Finance",
    icon: PiggyBank
  },
  {
    id: "salary",
    name: "Salary Calculator",
    description: "Estimate gross and take-home salary",
    category: "Salary & Work",
    icon: Wallet
  },
  {
    id: "profit",
    name: "Business Profit Calculator",
    description: "Calculate revenue, profit and margin",
    category: "Business",
    icon: Wallet
  }
];

const money = (value: number) =>
  `Rs. ${Math.round(value).toLocaleString("en-LK")}`;

const numberValue = (value: string) => {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
};

async function shareResult(text: string) {
  try {
    if (navigator.share) {
      await navigator.share({
        title: "LankaCalc Result",
        text
      });
      return;
    }

    await navigator.clipboard.writeText(text);
    alert("Result copied to clipboard.");
  } catch {
    // User cancelled sharing.
  }
}

function Field({
  label,
  value,
  onChange,
  suffix
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <div className="input-wrapper">
        <input
          inputMode="decimal"
          value={value}
          onChange={(event) =>
            onChange(event.target.value.replace(/[^\d.-]/g, ""))
          }
        />

        {suffix && <small>{suffix}</small>}
      </div>
    </label>
  );
}

function ResultCard({
  label,
  value,
  primary = false
}: {
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div className={`result-card ${primary ? "primary" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AdPlaceholder() {
  return (
    <div className="ad-placeholder">
      <span>ADVERTISEMENT</span>
      <b>Ad placement</b>
    </div>
  );
}

function CalculatorPage({
  title,
  description,
  children,
  disclaimer
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  disclaimer: string;
}) {
  return (
    <main className="calculator-page">
      <button className="back-button" onClick={() => (location.hash = "")}>
        ← All calculators
      </button>

      <section className="calculator-heading">
        <span className="eyebrow">LankaCalc</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <section className="calculator-box">
        {children}

        <details>
          <summary>How this calculation works</summary>
          <p>
            Your calculation is performed directly in your browser. Basic
            calculations do not require an account or database.
          </p>
        </details>

        <p className="disclaimer">⚠️ {disclaimer}</p>
      </section>

      <AdPlaceholder />
    </main>
  );
}

function PercentageCalculator() {
  const [percentage, setPercentage] = useState("10");
  const [amount, setAmount] = useState("5000");

  const result =
    (numberValue(percentage) / 100) * numberValue(amount);

  return (
    <CalculatorPage
      title="Percentage Calculator"
      description="Calculate a percentage of any amount instantly."
      disclaimer="This is a mathematical calculation."
    >
      <div className="form-grid">
        <Field
          label="Percentage"
          value={percentage}
          onChange={setPercentage}
          suffix="%"
        />

        <Field
          label="Amount"
          value={amount}
          onChange={setAmount}
          suffix="LKR"
        />
      </div>

      <ResultCard label="Result" value={money(result)} primary />

      <button
        className="share-button"
        onClick={() =>
          shareResult(
            `🔥 LankaCalc Result\n\n${percentage}% of ${money(
              numberValue(amount)
            )} = ${money(result)}`
          )
        }
      >
        <Share2 size={16} />
        Share Result
      </button>
    </CalculatorPage>
  );
}

function DiscountCalculator() {
  const [price, setPrice] = useState("10000");
  const [discount, setDiscount] = useState("10");

  const original = numberValue(price);
  const percentage = numberValue(discount);
  const saved = (original * percentage) / 100;
  const finalPrice = Math.max(0, original - saved);

  return (
    <CalculatorPage
      title="Discount Calculator"
      description="Find the discount amount, final price and savings."
      disclaimer="Final prices may differ if additional charges apply."
    >
      <div className="form-grid">
        <Field
          label="Original price"
          value={price}
          onChange={setPrice}
          suffix="LKR"
        />

        <Field
          label="Discount"
          value={discount}
          onChange={setDiscount}
          suffix="%"
        />
      </div>

      <div className="results-grid">
        <ResultCard label="Discount" value={money(saved)} />
        <ResultCard label="Final price" value={money(finalPrice)} primary />
        <ResultCard label="You save" value={money(saved)} />
      </div>

      <button
        className="share-button"
        onClick={() =>
          shareResult(
            `🔥 LankaCalc Discount Result\n\nFinal price: ${money(
              finalPrice
            )}\nYou save: ${money(saved)}`
          )
        }
      >
        <Share2 size={16} />
        Share Result
      </button>
    </CalculatorPage>
  );
}

function FuelCalculator() {
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("15");
  const [fuelPrice, setFuelPrice] = useState("300");
  const [roundTrip, setRoundTrip] = useState(false);

  const km =
    numberValue(distance) * (roundTrip ? 2 : 1);

  const litres =
    km / Math.max(numberValue(efficiency), 0.01);

  const cost = litres * numberValue(fuelPrice);

  return (
    <CalculatorPage
      title="Fuel Cost Calculator"
      description="Estimate fuel usage and cost for your journey."
      disclaimer="Fuel price and vehicle efficiency are estimates provided by you."
    >
      <div className="form-grid">
        <Field
          label="Distance"
          value={distance}
          onChange={setDistance}
          suffix="km"
        />

        <Field
          label="Fuel efficiency"
          value={efficiency}
          onChange={setEfficiency}
          suffix="km/L"
        />

        <Field
          label="Fuel price"
          value={fuelPrice}
          onChange={setFuelPrice}
          suffix="LKR/L"
        />
      </div>

      <button
        className="mode-button"
        onClick={() => setRoundTrip(!roundTrip)}
      >
        {roundTrip ? "✓ Round trip" : "↔ One way"}
      </button>

      <div className="results-grid">
        <ResultCard label="Distance" value={`${km} km`} />
        <ResultCard
          label="Estimated fuel"
          value={`${litres.toFixed(2)} L`}
          primary
        />
        <ResultCard
          label="Estimated cost"
          value={money(cost)}
          primary
        />
      </div>

      <button
        className="share-button"
        onClick={() =>
          shareResult(
            `🔥 LankaCalc Fuel Result\n\nDistance: ${km} km\nFuel: ${litres.toFixed(
              2
            )} L\nEstimated cost: ${money(cost)}`
          )
        }
      >
        <Share2 size={16} />
        Share Result
      </button>
    </CalculatorPage>
  );
}

function LoanCalculator() {
  const [amount, setAmount] = useState("5000000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");

  const principal = numberValue(amount);
  const monthlyRate = numberValue(rate) / 1200;
  const months = Math.max(1, numberValue(years) * 12);

  const monthlyPayment =
    monthlyRate > 0
      ? (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : principal / months;

  const totalRepayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalRepayment - principal);

  return (
    <CalculatorPage
      title="Loan / EMI Calculator"
      description="Estimate monthly payments and total loan cost."
      disclaimer="Actual lender repayment can differ because of fees, insurance, rate changes and lender-specific terms."
    >
      <div className="form-grid">
        <Field
          label="Loan amount"
          value={amount}
          onChange={setAmount}
          suffix="LKR"
        />

        <Field
          label="Annual interest rate"
          value={rate}
          onChange={setRate}
          suffix="%"
        />

        <Field
          label="Loan period"
          value={years}
          onChange={setYears}
          suffix="years"
        />
      </div>

      <div className="results-grid">
        <ResultCard
          label="Monthly payment"
          value={money(monthlyPayment)}
          primary
        />

        <ResultCard
          label="Total repayment"
          value={money(totalRepayment)}
        />

        <ResultCard
          label="Total interest"
          value={money(totalInterest)}
        />
      </div>

      <button
        className="share-button"
        onClick={() =>
          shareResult(
            `🔥 LankaCalc Loan Result\n\nLoan: ${money(
              principal
            )}\nMonthly payment: ${money(
              monthlyPayment
            )}\nTotal interest: ${money(totalInterest)}`
          )
        }
      >
        <Share2 size={16} />
        Share Result
      </button>
    </CalculatorPage>
  );
}

function SalaryCalculator() {
  const [basic, setBasic] = useState("100000");
  const [allowances, setAllowances] = useState("20000");
  const [overtime, setOvertime] = useState("5000");
  const [deductions, setDeductions] = useState("0");

  const gross =
    numberValue(basic) +
    numberValue(allowances) +
    numberValue(overtime);

  const deduction = numberValue(deductions);
  const takeHome = Math.max(0, gross - deduction);

  return (
    <CalculatorPage
      title="Salary Calculator"
      description="Estimate gross salary, deductions and take-home pay."
      disclaimer="Deduction and tax assumptions can change. Verify current official rates before payroll decisions."
    >
      <div className="form-grid">
        <Field
          label="Basic salary"
          value={basic}
          onChange={setBasic}
          suffix="LKR"
        />

        <Field
          label="Allowances"
          value={allowances}
          onChange={setAllowances}
          suffix="LKR"
        />

        <Field
          label="Overtime"
          value={overtime}
          onChange={setOvertime}
          suffix="LKR"
        />

        <Field
          label="Other deductions"
          value={deductions}
          onChange={setDeductions}
          suffix="LKR"
        />
      </div>

      <div className="results-grid">
        <ResultCard label="Gross salary" value={money(gross)} primary />
        <ResultCard label="Deductions" value={money(deduction)} />
        <ResultCard
          label="Estimated take-home"
          value={money(takeHome)}
          primary
        />
      </div>

      <p className="small-note">
        V1 uses manually entered deductions. Official EPF/ETF/tax rules can be
        configured in a future update.
      </p>

      <button
        className="share-button"
        onClick={() =>
          shareResult(
            `🔥 LankaCalc Salary Result\n\nGross: ${money(
              gross
            )}\nDeductions: ${money(
              deduction
            )}\nTake-home: ${money(takeHome)}`
          )
        }
      >
        <Share2 size={16} />
        Share Result
      </button>
    </CalculatorPage>
  );
}

function ProfitCalculator() {
  const [selling, setSelling] = useState("1000");
  const [costPrice, setCostPrice] = useState("700");
  const [quantity, setQuantity] = useState("100");
  const [expenses, setExpenses] = useState("0");

  const revenue =
    numberValue(selling) * numberValue(quantity);

  const productCost =
    numberValue(costPrice) * numberValue(quantity);

  const totalCost = productCost + numberValue(expenses);
  const profit = revenue - totalCost;

  const margin = revenue ? (profit / revenue) * 100 : 0;

  const markup = productCost
    ? (profit / productCost) * 100
    : 0;

  return (
    <CalculatorPage
      title="Business Profit Calculator"
      description="Calculate revenue, costs, profit, margin and markup."
      disclaimer="Use your actual accounting costs when making business decisions."
    >
      <div className="form-grid">
        <Field
          label="Selling price / unit"
          value={selling}
          onChange={setSelling}
          suffix="LKR"
        />

        <Field
          label="Cost price / unit"
          value={costPrice}
          onChange={setCostPrice}
          suffix="LKR"
        />

        <Field
          label="Quantity"
          value={quantity}
          onChange={setQuantity}
        />

        <Field
          label="Other expenses"
          value={expenses}
          onChange={setExpenses}
          suffix="LKR"
        />
      </div>

      <div className="results-grid">
        <ResultCard label="Revenue" value={money(revenue)} />
        <ResultCard label="Total cost" value={money(totalCost)} />
        <ResultCard label="Net profit" value={money(profit)} primary />
        <ResultCard label="Profit margin" value={`${margin.toFixed(2)}%`} />
        <ResultCard label="Markup" value={`${markup.toFixed(2)}%`} />
      </div>

      <button
        className="share-button"
        onClick={() =>
          shareResult(
            `🔥 LankaCalc Profit Result\n\nRevenue: ${money(
              revenue
            )}\nCost: ${money(
              totalCost
            )}\nProfit: ${money(
              profit
            )}\nMargin: ${margin.toFixed(2)}%`
          )
        }
      >
        <Share2 size={16} />
        Share Result
      </button>
    </CalculatorPage>
  );
}

function Home({
  onOpenCalculator
}: {
  onOpenCalculator: (id: CalculatorId) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return calculators;

    return calculators.filter((item) =>
      `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  return (
    <main>
      <section className="hero">
        <span className="eyebrow">🇱🇰 Built for Sri Lanka</span>

        <h1>
          Sri Lanka’s <em>Smart Calculator</em> Hub
        </h1>

        <p>
          Calculate loans, salaries, fuel costs, profits, discounts and more —
          instantly.
        </p>

        <div className="search-box">
          <Search size={20} />

          <input
            placeholder="Search a calculator…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button onClick={() => setSearch("")}>
              <X size={18} />
            </button>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Popular</span>
            <h2>Start calculating</h2>
          </div>
        </div>

        <div className="calculator-grid">
          {filtered.map((calculator) => {
            const Icon = calculator.icon;

            return (
              <button
                className="calculator-card"
                key={calculator.id}
                onClick={() => onOpenCalculator(calculator.id)}
              >
                <div className="calculator-icon">
                  <Icon size={20} />
                </div>

                <div className="calculator-info">
                  <h3>{calculator.name}</h3>
                  <p>{calculator.description}</p>
                  <small>{calculator.category}</small>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <AdPlaceholder />
    </main>
  );
}

function App() {
  const [page, setPage] = useState(location.hash.slice(1) || "home");

  const open = (value: string) => {
    location.hash = value;
    setPage(value);
  };

  const calculatorPages: Record<
    string,
    React.ReactNode
  > = {
    percentage: <PercentageCalculator />,
    discount: <DiscountCalculator />,
    fuel: <FuelCalculator />,
    loan: <LoanCalculator />,
    salary: <SalaryCalculator />,
    profit: <ProfitCalculator />
  };

  const content =
    page === "home" ? (
      <Home onOpenCalculator={open} />
    ) : calculatorPages[page] ? (
      calculatorPages[page]
    ) : (
      <Home onOpenCalculator={open} />
    );

  return (
    <>
      <header className="site-header">
        <button className="brand" onClick={() => open("home")}>
          <span className="brand-logo">
            <Calculator size={20} />
          </span>

          <span>
            LankaCalc
            <small>Calculate smarter. Live better. 🇱🇰</small>
          </span>
        </button>

        <nav>
          <button onClick={() => open("home")}>Home</button>
          <button onClick={() => open("percentage")}>
            Calculators
          </button>
        </nav>

        <button className="menu-button">
          <Menu size={22} />
        </button>
      </header>

      {content}

      <footer>
        <b>LankaCalc 🇱🇰</b>
        <span>Simple calculators made for Sri Lanka.</span>
      </footer>

      <nav className="mobile-nav">
        <button onClick={() => open("home")}>
          <Home size={18} />
          Home
        </button>

        <button onClick={() => open("percentage")}>
          <Calculator size={18} />
          Calculators
        </button>

        <button onClick={() => open("home")}>
          <Clock3 size={18} />
          History
        </button>

        <button onClick={() => open("home")}>
          <Settings size={18} />
          Settings
        </button>
      </nav>
    </>
  );
}

export default App;
