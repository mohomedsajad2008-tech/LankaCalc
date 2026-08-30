export type CalculatorDefinition = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  keywords: string[];
};

export const calculatorDefinitions: CalculatorDefinition[] = [
  {
    id: "percentage",
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    category: "General",
    description: "Calculate percentages quickly.",
    keywords: ["percentage", "percent", "%"]
  },
  {
    id: "discount",
    name: "Discount Calculator",
    slug: "discount-calculator",
    category: "Shopping",
    description: "Calculate discounts and final prices.",
    keywords: ["discount", "sale", "shopping", "saving"]
  },
  {
    id: "fuel",
    name: "Fuel Cost Calculator",
    slug: "fuel-cost-calculator",
    category: "Vehicles",
    description: "Estimate fuel usage and trip cost.",
    keywords: ["fuel", "petrol", "diesel", "car", "trip"]
  },
  {
    id: "loan",
    name: "Loan / EMI Calculator",
    slug: "loan-calculator",
    category: "Finance",
    description: "Estimate loan repayments and interest.",
    keywords: ["loan", "emi", "interest", "bank", "finance"]
  },
  {
    id: "salary",
    name: "Salary Calculator",
    slug: "salary-calculator",
    category: "Salary & Work",
    description: "Estimate gross salary and take-home pay.",
    keywords: ["salary", "pay", "income", "epf", "etf"]
  },
  {
    id: "profit",
    name: "Business Profit Calculator",
    slug: "business-profit-calculator",
    category: "Business",
    description: "Calculate revenue, profit and margin.",
    keywords: ["profit", "business", "margin", "markup", "revenue"]
  }
];
