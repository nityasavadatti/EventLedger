const validateAmount = require("../../services/amountValidator");
const { validateRequiredFields } = require("../../services/requiredFieldsValidator");
const { validateOverallBudget, checkCategorySpending } = require("../../services/budgetValidator");
const validateCorrection = require("../../services/correctionValidator");
const findPossibleDuplicate = require("../../services/duplicateChecker");

function validateTransaction({ transaction = {}, event = {}, existingTransactions = [], categoryExpenses = {} }) {
  const checks = [
    validateRequiredFields(transaction),
    validateAmount(transaction.amount),
    validateCorrection(transaction),
    validateOverallBudget(event.approvedBudget, event.categoryBudgets || {})
  ];
  const errors = checks.filter(check => check && check.passed === false);
  const warnings = [];
  const duplicate = findPossibleDuplicate(transaction, existingTransactions);
  if (duplicate.warning) warnings.push(duplicate);

  if (transaction.category) {
    const expenses = { ...categoryExpenses };
    if (transaction.type === "expense" && Number.isFinite(Number(transaction.amount))) {
      expenses[transaction.category] = Number(expenses[transaction.category] || 0) + Number(transaction.amount);
    }
    const categoryCheck = checkCategorySpending(transaction.category, event.categoryBudgets || {}, expenses);
    if (categoryCheck.warning) warnings.push(categoryCheck);
  }
  return {
    valid: errors.length === 0,
    status: errors.length ? "BLOCKED" : warnings.length ? "VALID_WITH_WARNINGS" : "VALID",
    message: errors.length ? "Transaction blocked because one or more rules failed." :
      warnings.length ? "Blocking rules passed; review the warnings." : "Transaction passed the configured blocking rules.",
    errors, warnings, checks
  };
}
module.exports = { validateTransaction };
