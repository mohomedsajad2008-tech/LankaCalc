import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Car,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  DollarSign,
  Fuel,
  History,
  Home,
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
  | "profit";

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
    icon: Fuel,
    popular: true,
  },
  {
    id: "profit",
    name: "Profit Calculator",
    description: "Calculate revenue, profit and margin.",
    category: "Business",
    icon: DollarSign,
    popular: true,
  },
  {
    id: "discount",
    name: "Discount Calculator",
    description: "Find your discount, savings and final price.",
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
];

const CATEGORIES = [
  { name: "Finance", icon: PiggyBank },
  { name: "Vehicles", icon: Car },
  { name: "Salary & Work", icon: Wallet },
  { name: "Business", icon: DollarSign },
  { name: "Household", icon: Home },
  { name: "Shopping", icon: ShoppingBag },
];

const money = (n: number) =>
  `Rs. ${Math.round(n).toLocaleString("en-LK")}`;

function num(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function saveHistory(name: string, result: string) {
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
    JSON.stringify([item, ...existing].slice(0, 30))
  );
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
      alert("Result copied!");
    }
  } catch {
    // cancelled
  }
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
      disclaimer="Mathematical estimate only."
    >
      <Input label="Percentage" value={p} setValue={setP} suffix="%" />
      <Input
        label="Amount"
        value={amount}
        setValue={setAmount}
        suffix="LKR"
      />

      <Result label="Result" value={money(result)} main />

      <ShareButton
        name="Percentage calculation"
        result={money(result)}
        text={`🔥 LankaCalc Result\n\n${p}% of ${money(
          num(amount)
        )} = ${money(result)}\n\nCalculate smarter. Live better. 🇱🇰`}
      />
    </CalcPage>
  );
}

function Discount() {
  const [price, setPrice] = useState("10000");
  const [discount, setDiscount] = useState("10");

  const saved = (num(price) * num(discount)) / 100;
  const final = Math.max(0, num(price) - saved);

  return (
    <CalcPage
      title="Discount Calculator"
      description="Find the final price and how much you save."
      icon={ShoppingBag}
      disclaimer="Final checkout prices may differ if additional charges apply."
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
        text={`🔥 LankaCalc Result\n\nFinal price: ${money(
          final
        )}\nYou save: ${money(saved)}\n\n🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Fuel() {
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("15");
  const [price, setPrice] = useState("300");
  const [roundTrip, setRoundTrip] = useState(false);

  const km = num(distance) * (roundTrip ? 2 : 1);
  const litres = km / Math.max(num(efficiency), 0.01);
  const cost = litres * num(price);

  return (
    <CalcPage
      title="Fuel Cost Calculator"
      description="Estimate fuel usage and trip cost."
      icon={Fuel}
      disclaimer="Fuel prices and vehicle efficiency can change."
    >
      <Input label="Distance" value={distance} setValue={setDistance} suffix="km" />

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
        text={`🔥 LankaCalc Fuel Result\n\nDistance: ${km} km\nFuel: ${litres.toFixed(
          2
        )} L\nEstimated cost: ${money(cost)}\n\n🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Loan() {
  const [amount, setAmount] = useState("5000000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");

  const principal = num(amount);
  const months = Math.max(1, num(years) * 12);
  const monthlyRate = num(rate) / 1200;

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
      disclaimer="Actual lender repayment may differ because of fees, insurance and lender-specific terms."
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

      <ShareButton
        name="Loan calculation"
        result={money(payment)}
        text={`🔥 LankaCalc Loan Result\n\nLoan amount: ${money(
          principal
        )}\nMonthly payment: ${money(
          payment
        )}\nTotal interest: ${money(interest)}\n\n🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Salary() {
  const [basic, setBasic] = useState("100000");
  const [allowance, setAllowance] = useState("20000");
  const [overtime, setOvertime] = useState("5000");
  const [deduction, setDeduction] = useState("0");

  const gross = num(basic) + num(allowance) + num(overtime);
  const takeHome = Math.max(0, gross - num(deduction));

  return (
    <CalcPage
      title="Salary Calculator"
      description="Estimate your gross salary and take-home pay."
      icon={Wallet}
      disclaimer="Tax, EPF, ETF and other official deduction rules may change. Verify current rates."
    >
      <Input label="Basic salary" value={basic} setValue={setBasic} suffix="LKR" />
      <Input label="Allowances" value={allowance} setValue={setAllowance} suffix="LKR" />
      <Input label="Overtime" value={overtime} setValue={setOvertime} suffix="LKR" />
      <Input label="Other deductions" value={deduction} setValue={setDeduction} suffix="LKR" />

      <div className="lc-results">
        <Result label="Gross salary" value={money(gross)} />
        <Result label="Deductions" value={money(num(deduction))} />
        <Result label="Take-home" value={money(takeHome)} main />
      </div>

      <ShareButton
        name="Salary calculation"
        result={money(takeHome)}
        text={`🔥 LankaCalc Salary Result\n\nGross: ${money(
          gross
        )}\nDeductions: ${money(
          num(deduction)
        )}\nEstimated take-home: ${money(takeHome)}\n\n🇱🇰 LankaCalc`}
      />
    </CalcPage>
  );
}

function Profit() {
  const [selling, setSelling] = useState("1000");
  const [cost, setCost] = useState("700");
  const [quantity, setQuantity] = useState("100");
  const [expenses, setExpenses] = useState("0");

  const revenue = num(selling) * num(quantity);
  const totalCost = num(cost) * num(quantity) + num(expenses);
  const profit = revenue - totalCost;
  const margin = revenue ? (profit / revenue) * 100 : 0;

  return (
    <CalcPage
      title="Business Profit Calculator"
      description="Calculate revenue, costs, profit and margin."
      icon={DollarSign}
      disclaimer="Use actual accounting costs for important business decisions."
    >
      <Input label="Selling price / unit" value={selling} setValue={setSelling} suffix="LKR" />
      <Input label="Cost price / unit" value={cost} setValue={setCost} suffix="LKR" />
      <Input label="Quantity" value={quantity} setValue={setQuantity} />
      <Input label="Other expenses" value={expenses} setValue={setExpenses} suffix="LKR" />

      <div className="lc-results">
        <Result label="Revenue" value={money(revenue)} />
        <Result label="Total cost" value={money(totalCost)} />
        <Result label="Profit" value={money(profit)} main />
        <Result label="Margin" value={`${margin.toFixed(2)}%`} />
      </div>

      <ShareButton
        name="Business profit"
        result={money(profit)}
        text={`🔥 LankaCalc Profit Result\n\nRevenue: ${money(
          revenue
        )}\nCost: ${money(
          totalCost
        )}\nProfit: ${money(
          profit
        )}\nMargin: ${margin.toFixed(2)}%\n\n🇱🇰 LankaCalc`}
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
            <span className="lc-kicker">LANKACALC</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>

        <section className="lc-calculator">
          <div className="lc-form">{children}</div>

          <details className="lc-how">
            <summary>How this calculation works</summary>
            <p>
              Enter your values and LankaCalc performs the calculation
              instantly in your browser. No database is required.
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
    if (!search.trim()) return CALCULATORS;

    const q = search.toLowerCase();

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
            Calculate smarter.
            <br />
            <span>Live better.</span>
          </h1>

          <p>
            Simple calculators for money, work, vehicles,
            business and everyday life.
          </p>

          <div className="lc-search">
            <Search size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a calculator..."
            />

            {search && (
              <button onClick={() => setSearch("")}>
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
                onClick={() => openCalc(id as CalcId)}
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
            <span className="lc-kicker">POPULAR</span>
            <h2>What do you need to calculate?</h2>
          </div>

          <button onClick={() => setPage("calculators")}>
            View all <ArrowRight size={15} />
          </button>
        </div>

        <div className="lc-grid">
          {results.map((calc) => {
            const Icon = calc.icon;

            return (
              <button
                className="lc-card"
                key={calc.id}
                onClick={() => openCalc(calc.id)}
              >
                <div className="lc-card-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <h3>{calc.name}</h3>
                  <p>{calc.description}</p>
                  <small>{calc.category}</small>
                </div>

                <ChevronRight className="lc-chevron" size={18} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="lc-section">
        <div className="lc-section-title">
          <div>
            <span className="lc-kicker">EXPLORE</span>
            <h2>Calculator categories</h2>
          </div>
        </div>

        <div className="lc-category-grid">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;

            return (
              <button
                className="lc-category"
                key={category.name}
                onClick={() => setPage("calculators")}
              >
                <Icon size={19} />
                <span>{category.name}</span>
                <ChevronRight size={15} />
              </button>
            );
          })}
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
          <span className="lc-kicker">LANKACALC</span>
          <h1>All calculators</h1>
          <p>Fast, simple tools built for everyday Sri Lankan needs.</p>
        </div>

        <div className="lc-search lc-inner-search">
          <Search size={19} />
          <input
            placeholder="Search calculators..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="lc-grid">
          {filtered.map((calc) => {
            const Icon = calc.icon;

            return (
              <button
                className="lc-card"
                key={calc.id}
                onClick={() => openCalc(calc.id)}
              >
                <div className="lc-card-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <h3>{calc.name}</h3>
                  <p>{calc.description}</p>
                  <small>{calc.category}</small>
                </div>

                <ChevronRight className="lc-chevron" size={18} />
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
    setItems(
      JSON.parse(
        localStorage.getItem("lankacalc-history") || "[]"
      )
    );
  }, []);

  function clear() {
    localStorage.removeItem("lankacalc-history");
    setItems([]);
  }

  return (
    <main className="lc-page">
      <div className="lc-page-inner">
        <div className="lc-list-head">
          <span className="lc-kicker">LOCAL STORAGE</span>
          <h1>History</h1>
          <p>Saved locally on this device.</p>
        </div>

        {items.length > 0 && (
          <button className="lc-clear" onClick={clear}>
            <Trash2 size={16} />
            Clear history
          </button>
        )}

        {items.length === 0 ? (
          <div className="lc-empty">
            <History size={30} />
            <h3>No calculations yet</h3>
            <p>Your shared calculations will appear here.</p>
          </div>
        ) : (
          <div className="lc-history">
            {items.map((item) => (
              <div className="lc-history-item" key={item.id}>
                <div>
                  <b>{item.name}</b>
                  <small>
                    {new Date(item.date).toLocaleString()}
                  </small>
                </div>

                <strong>{item.result}</strong>
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
          <span className="lc-kicker">PREFERENCES</span>
          <h1>Settings</h1>
          <p>Customize your LankaCalc experience.</p>
        </div>

        <section className="lc-settings">
          <div className="lc-setting">
            <div>
              <b>Appearance</b>
              <small>Choose your preferred theme.</small>
            </div>

            <div className="lc-theme-buttons">
              <button
                className={theme === "light" ? "active" : ""}
                onClick={() => setTheme("light")}
              >
                <Sun size={16} />
                Light
              </button>

              <button
                className={theme === "dark" ? "active" : ""}
                onClick={() => setTheme("dark")}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>

          <div className="lc-setting">
            <div>
              <b>Currency</b>
              <small>Default currency for LankaCalc.</small>
            </div>

            <strong>LKR / Rs.</strong>
          </div>

          <div className="lc-setting">
            <div>
              <b>Country</b>
              <small>Default country.</small>
            </div>

            <strong>🇱🇰 Sri Lanka</strong>
          </div>

          <div className="lc-setting">
            <div>
              <b>Privacy</b>
              <small>Your calculations are processed locally.</small>
            </div>

            <Check size={19} />
          </div>
        </section>
      </div>
    </main>
  );
}

function App() {
  const [page, setPage] = useState(
    location.hash.replace("#", "") || "home"
  );

  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("lankacalc-theme") as Theme) ||
      "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("lankacalc-theme", theme);
  }, [theme]);

  useEffect(() => {
    const listener = () =>
      setPage(location.hash.replace("#", "") || "home");

    window.addEventListener("hashchange", listener);

    return () =>
      window.removeEventListener("hashchange", listener);
  }, []);

  function navigate(value: string) {
    location.hash = value;
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCalc(id: CalcId) {
    navigate(id);
  }

  let content: React.ReactNode;

  if (page === "home") {
    content = (
      <Home
        openCalc={openCalc}
        setPage={navigate}
      />
    );
  } else if (page === "calculators") {
    content = <Calculators openCalc={openCalc} />;
  } else if (page === "history") {
    content = <HistoryPage />;
  } else if (page === "settings") {
    content = (
      <SettingsPage
        theme={theme}
        setTheme={setTheme}
      />
    );
  } else if (page === "percentage") {
    content = <Percentage />;
  } else if (page === "discount") {
    content = <Discount />;
  } else if (page === "fuel") {
    content = <Fuel />;
  } else if (page === "loan") {
    content = <Loan />;
  } else if (page === "salary") {
    content = <Salary />;
  } else if (page === "profit") {
    content = <Profit />;
  } else {
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
          onClick={() => navigate("home")}
        >
          <span className="lc-logo">
            <Calculator size={20} />
          </span>

          <span>
            LankaCalc
            <small>Calculate smarter. Live better. 🇱🇰</small>
          </span>
        </button>

        <nav className="lc-desktop-nav">
          <button onClick={() => navigate("home")}>
            Home
          </button>

          <button
            onClick={() => navigate("calculators")}
          >
            Calculators
          </button>

          <button onClick={() => navigate("history")}>
            History
          </button>

          <button onClick={() => navigate("settings")}>
            Settings
          </button>
        </nav>

        <button
          className="lc-header-theme"
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
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
          <p>Simple calculators made for Sri Lanka.</p>
        </div>

        <span>
          Estimates & general calculations. Verify official
          rates where applicable.
        </span>
      </footer>

      <nav className="lc-bottom-nav">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => navigate("home")}
        >
          <Home size={18} />
          Home
        </button>

        <button
          className={
            page === "calculators" ? "active" : ""
          }
          onClick={() => navigate("calculators")}
        >
          <Calculator size={18} />
          Calculators
        </button>

        <button
          className={page === "history" ? "active" : ""}
          onClick={() => navigate("history")}
        >
          <Clock3 size={18} />
          History
        </button>

        <button
          className={page === "settings" ? "active" : ""}
          onClick={() => navigate("settings")}
        >
          <Settings size={18} />
          Settings
        </button>
      </nav>
    </div>
  );
}

export default App;
