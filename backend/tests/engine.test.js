const test = require("node:test");
const assert = require("node:assert/strict");
const validateAmount = require("../services/amountValidator");
const { validateRequiredFields } = require("../services/requiredFieldsValidator");
const { validateOverallBudget, checkCategorySpending } = require("../services/budgetValidator");
const validateCorrection = require("../services/correctionValidator");
const findPossibleDuplicate = require("../services/duplicateChecker");
const { calculateFinancials } = require("../services/financialCalculator");
const { validateTransaction } = require("../engines/logicRule/logicRuleEngine");

test("RULE-03 accepts a positive amount", () => assert.equal(validateAmount(500).passed, true));
test("RULE-03 rejects zero and negative amounts", () => {
  assert.equal(validateAmount(0).passed, false); assert.equal(validateAmount(-1).passed, false);
});
test("RULE-04 detects missing required fields", () => assert.equal(validateRequiredFields({}).passed, false));
test("RULE-01 blocks allocations above approved budget", () =>
  assert.equal(validateOverallBudget(1000, { Food: 700, Travel: 400 }).passed, false));
test("RULE-02 warns on category overspending", () => {
  const result = checkCategorySpending("Food", { Food: 100 }, { Food: 150 });
  assert.equal(result.warning, true); assert.equal(result.overspend, 50);
});
test("RULE-05 requires correction reference and reason", () => {
  assert.equal(validateCorrection({ type: "correction" }).passed, false);
  assert.equal(validateCorrection({ type: "correction", originalTransactionId: "T0", correctionReason: "Fix" }).passed, true);
});
test("RULE-06 flags possible duplicates", () => {
  const tx = { transactionId:"T2",eventId:"E1",category:"Food",amount:100,type:"expense",date:"2026-11-06",description:"Lunch" };
  assert.equal(findPossibleDuplicate(tx, [{...tx,transactionId:"T1"}]).warning, true);
});
test("financial calculations return expected values", () => {
  const result = calculateFinancials({ approvedBudget:50000,totalIncome:45000,totalExpenses:32000,
    categoryBudgets:{Food:15000},categoryExpenses:{Food:17000} });
  assert.equal(result.recordedCashBalance, 13000);
  assert.equal(result.unspentApprovedBudget, 18000);
  assert.equal(result.categoryVariance.Food.variance, 2000);
});
test("engine blocks invalid transaction amount", () => {
  const result = validateTransaction({ transaction:{transactionId:"T1",eventId:"E1",category:"Food",amount:0,
    type:"expense",date:"2026-11-06",description:"Lunch",createdBy:"U1"},
    event:{approvedBudget:1000,categoryBudgets:{Food:500}} });
  assert.equal(result.valid, false);
});
