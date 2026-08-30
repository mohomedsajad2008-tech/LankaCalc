export type CalculatorCategory =
  | "Finance"
  | "Vehicles"
  | "Salary & Work"
  | "Business"
  | "Household"
  | "Shopping"
  | "General";

export type CalculatorConfig = {
  id: string;
  name: string;
  description: string;
  category: CalculatorCategory;
  keywords: string[];
  popular?: boolean;
};

export const CALCULATORS: CalculatorConfig[] = [
  // FINANCE
  {
    id: "loan",
    name: "Loan Calculator",
    description: "Estimate monthly repayments and total interest.",
    category: "Finance",
    keywords: ["loan", "emi", "interest", "bank", "repayment"],
    popular: true,
  },
  {
    id: "emi",
    name: "EMI Calculator",
    description: "Calculate your estimated monthly loan instalment.",
    category: "Finance",
    keywords: ["emi", "loan", "monthly payment"],
    popular: true,
  },
  {
    id: "interest",
    name: "Interest Calculator",
    description: "Calculate simple interest and total amount.",
    category: "Finance",
    keywords: ["interest", "simple interest"],
  },
  {
    id: "savings",
    name: "Savings Calculator",
    description: "Estimate how your savings can grow over time.",
    category: "Finance",
    keywords: ["saving", "savings", "money"],
  },
  {
    id: "investment",
    name: "Investment Calculator",
    description: "Estimate returns from an investment.",
    category: "Finance",
    keywords: ["investment", "return", "roi"],
  },
  {
    id: "compound-interest",
    name: "Compound Interest",
    description: "Calculate growth using compound interest.",
    category: "Finance",
    keywords: ["compound", "interest", "investment"],
  },

  // VEHICLES
  {
    id: "fuel",
    name: "Fuel Cost Calculator",
    description: "Estimate fuel usage and trip cost.",
    category: "Vehicles",
    keywords: ["fuel", "petrol", "diesel", "car", "trip"],
    popular: true,
  },
  {
    id: "trip-fuel",
    name: "Trip Fuel Calculator",
    description: "Estimate fuel needed for a complete journey.",
    category: "Vehicles",
    keywords: ["trip", "fuel", "journey", "travel"],
  },
  {
    id: "vehicle-loan",
    name: "Vehicle Loan Calculator",
    description: "Estimate monthly vehicle loan repayments.",
    category: "Vehicles",
    keywords: ["vehicle", "car", "loan", "leasing"],
  },
  {
    id: "vehicle-import",
    name: "Vehicle Import Calculator",
    description: "Estimate the landed cost of an imported vehicle.",
    category: "Vehicles",
    keywords: ["vehicle", "import", "customs", "car", "duty"],
    popular: true,
  },

  // SALARY
  {
    id: "salary",
    name: "Salary Calculator",
    description: "Estimate gross salary and take-home pay.",
    category: "Salary & Work",
    keywords: ["salary", "pay", "income", "epf", "etf"],
    popular: true,
  },
  {
    id: "daily-wage",
    name: "Daily Wage Calculator",
    description: "Convert monthly or hourly income into a daily wage.",
    category: "Salary & Work",
    keywords: ["daily", "wage", "salary", "pay"],
  },
  {
    id: "hourly-wage",
    name: "Hourly Wage Calculator",
    description: "Calculate your approximate hourly earnings.",
    category: "Salary & Work",
    keywords: ["hourly", "wage", "salary", "work"],
  },
  {
    id: "overtime",
    name: "Overtime Calculator",
    description: "Estimate overtime earnings from your hourly rate.",
    category: "Salary & Work",
    keywords: ["overtime", "salary", "work", "ot"],
  },

  // BUSINESS
  {
    id: "profit",
    name: "Profit Calculator",
    description: "Calculate revenue, costs, profit and margin.",
    category: "Business",
    keywords: ["profit", "business", "revenue", "cost"],
    popular: true,
  },
  {
    id: "markup",
    name: "Markup Calculator",
    description: "Calculate selling price and markup percentage.",
    category: "Business",
    keywords: ["markup", "profit", "price"],
  },
  {
    id: "margin",
    name: "Margin Calculator",
    description: "Calculate gross profit margin from your prices.",
    category: "Business",
    keywords: ["margin", "profit", "business"],
  },
  {
    id: "break-even",
    name: "Break-even Calculator",
    description: "Find the sales level needed to cover your costs.",
    category: "Business",
    keywords: ["break even", "business", "cost", "sales"],
  },
  {
    id: "vat",
    name: "VAT Calculator",
    description: "Calculate VAT-inclusive and VAT-exclusive prices.",
    category: "Business",
    keywords: ["vat", "tax", "business", "price"],
  },

  // HOUSEHOLD
  {
    id: "electricity",
    name: "Electricity Estimator",
    description: "Estimate appliance electricity usage and cost.",
    category: "Household",
    keywords: ["electricity", "ceb", "power", "bill", "units"],
    popular: true,
  },
  {
    id: "rent",
    name: "Rent Affordability Calculator",
    description: "Estimate a reasonable monthly rent budget.",
    category: "Household",
    keywords: ["rent", "house", "budget"],
  },
  {
    id: "budget",
    name: "Monthly Budget Calculator",
    description: "Plan your monthly income and expenses.",
    category: "Household",
    keywords: ["budget", "monthly", "expenses", "money"],
  },

  // SHOPPING
  {
    id: "discount",
    name: "Discount Calculator",
    description: "Find your discount, savings and final price.",
    category: "Shopping",
    keywords: ["discount", "sale", "shopping", "price"],
    popular: true,
  },
  {
    id: "price-per-unit",
    name: "Price-per-unit Calculator",
    description: "Compare products by their unit price.",
    category: "Shopping",
    keywords: ["unit price", "shopping", "compare", "price"],
  },
  {
    id: "installment",
    name: "Installment Calculator",
    description: "Estimate the cost of paying for a purchase in instalments.",
    category: "Shopping",
    keywords: ["installment", "payment", "shopping"],
  },

  // GENERAL
  {
    id: "percentage",
    name: "Percentage Calculator",
    description: "Solve everyday percentage calculations.",
    category: "General",
    keywords: ["percentage", "percent", "%"],
    popular: true,
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, weight, temperature, area and more.",
    category: "General",
    keywords: ["unit", "convert", "km", "kg", "temperature"],
  },
  {
    id: "currency",
    name: "Currency Converter",
    description: "Convert between LKR and major world currencies.",
    category: "General",
    keywords: ["currency", "lkr", "usd", "eur", "gbp", "money"],
    popular: true,
  },
  {
    id: "date",
    name: "Date Calculator",
    description: "Calculate dates, durations and days between dates.",
    category: "General",
    keywords: ["date", "days", "duration", "calendar"],
  },
  {
    id: "age",
    name: "Age Calculator",
    description: "Calculate your exact age from your date of birth.",
    category: "General",
    keywords: ["age", "birthday", "dob", "date"],
  },
];

export const CATEGORY_NAMES: CalculatorCategory[] = [
  "Finance",
  "Vehicles",
  "Salary & Work",
  "Business",
  "Household",
  "Shopping",
  "General",
];

export const POPULAR_CALCULATORS = CALCULATORS.filter(
  (calculator) => calculator.popular
);

export function searchCalculators(query: string) {
  const q = query.trim().toLowerCase();

  if (!q) {
    return CALCULATORS;
  }

  return CALCULATORS
    .map((calculator) => {
      const name = calculator.name.toLowerCase();
      const description = calculator.description.toLowerCase();
      const category = calculator.category.toLowerCase();
      const keywords = calculator.keywords.join(" ").toLowerCase();

      let score = 0;

      if (name === q) score += 100;
      if (name.startsWith(q)) score += 50;
      if (name.includes(q)) score += 35;
      if (keywords.includes(q)) score += 25;
      if (category.includes(q)) score += 15;
      if (description.includes(q)) score += 10;

      return {
        calculator,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.calculator);
}
