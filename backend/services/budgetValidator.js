const { isRuleEnabled } = require("../utils/ruleConfig");
function sumValues(obj = {}) {
  return Object.values(obj).reduce((sum, value) => sum + (Number.isFinite(Number(value)) ? Number(value) : 0), 0);
}
function validateOverallBudget(approvedBudget, categoryBudgets = {}) {
  if (!isRuleEnabled("RULE-01")) return { passed: true, skipped: true };
  const budget = Number(approvedBudget);
  const allocations = sumValues(categoryBudgets);
  const validBudget = Number.isFinite(budget) && budget >= 0;
  const passed = validBudget && allocations <= budget;
  return { passed, ruleCode: "RULE-01", approvedBudget: budget, totalCategoryAllocations: allocations,
    message: !validBudget ? "Approved budget must be a valid non-negative number." :
      passed ? "Category allocations are within the approved event budget." : "Total category allocations exceed the approved event budget." };
}
function checkCategorySpending(category, categoryBudgets = {}, categoryExpenses = {}) {
  if (!isRuleEnabled("RULE-02")) return { warning: false, skipped: true };
  const allocated = Number(categoryBudgets[category] || 0);
  const spent = Number(categoryExpenses[category] || 0);
  const overspend = Math.max(0, spent - allocated);
  return { warning: overspend > 0, ruleCode: "RULE-02", category, allocatedBudget: allocated,
    categoryExpenses: spent, overspend,
    message: overspend > 0 ? `${category} category has exceeded its allocation by ${overspend}.` : `${category} spending is within allocation.` };
}
module.exports = { validateOverallBudget, checkCategorySpending, sumValues };
