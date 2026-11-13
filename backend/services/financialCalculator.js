function number(value, field) {
  const result = Number(value);
  if (!Number.isFinite(result)) throw new Error(`${field} must be a valid number.`);
  return result;
}
function calculateFinancials({ approvedBudget, totalIncome, totalExpenses, categoryBudgets = {}, categoryExpenses = {} }) {
  const budget = number(approvedBudget, "approvedBudget");
  const income = number(totalIncome, "totalIncome");
  const expenses = number(totalExpenses, "totalExpenses");
  const names = new Set([...Object.keys(categoryBudgets), ...Object.keys(categoryExpenses)]);
  const categoryVariance = {};
  for (const name of names) {
    const allocated = number(categoryBudgets[name] ?? 0, `${name} budget`);
    const spent = number(categoryExpenses[name] ?? 0, `${name} expenses`);
    const variance = spent - allocated;
    categoryVariance[name] = { budget: allocated, expenses: spent, variance,
      status: variance > 0 ? "OVERSPENT" : variance < 0 ? "UNDERSPENT" : "ON_BUDGET" };
  }
  return { recordedCashBalance: income - expenses, unspentApprovedBudget: budget - expenses, categoryVariance };
}
module.exports = { calculateFinancials };
