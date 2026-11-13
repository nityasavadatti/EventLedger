const { isRuleEnabled } = require("../utils/ruleConfig");
module.exports = function validateAmount(amount) {
  if (!isRuleEnabled("RULE-03")) return { passed: true, skipped: true };
  const passed = typeof amount === "number" && Number.isFinite(amount) && amount > 0;
  return { passed, ruleCode: "RULE-03",
    message: passed ? "Transaction amount is valid." : "Amount must be a finite number greater than zero." };
};
