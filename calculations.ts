export function percentageOf(
  percentage: number,
  amount: number
): number {
  return (percentage / 100) * amount;
}

export function discountAmount(
  price: number,
  discountPercent: number
): number {
  return (price * discountPercent) / 100;
}

export function discountFinalPrice(
  price: number,
  discountPercent: number
): number {
  return Math.max(
    0,
    price - discountAmount(price, discountPercent)
  );
}

export function fuelLitres(
  distanceKm: number,
  efficiencyKmPerLitre: number
): number {
  if (efficiencyKmPerLitre <= 0) return 0;

  return distanceKm / efficiencyKmPerLitre;
}

export function fuelCost(
  distanceKm: number,
  efficiencyKmPerLitre: number,
  fuelPrice: number
): number {
  return (
    fuelLitres(distanceKm, efficiencyKmPerLitre) *
    fuelPrice
  );
}

export function loanPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0;

  const monthlyRate = annualRate / 1200;

  if (monthlyRate === 0) {
    return principal / months;
  }

  return (
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

export function businessProfit(
  sellingPrice: number,
  costPrice: number,
  quantity: number,
  otherExpenses: number
): number {
  const revenue = sellingPrice * quantity;
  const cost = costPrice * quantity + otherExpenses;

  return revenue - cost;
}

export function profitMargin(
  profit: number,
  revenue: number
): number {
  if (revenue === 0) return 0;

  return (profit / revenue) * 100;
}
