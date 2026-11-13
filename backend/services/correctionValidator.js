const { isRuleEnabled } = require("../utils/ruleConfig");
module.exports = function validateCorrection(transaction = {}) {
  if (!isRuleEnabled("RULE-05")) return { passed: true, skipped: true };
  if (transaction.type !== "correction") return { passed: true, ruleCode: "RULE-05", message: "Correction traceability is not required." };
  const hasId = typeof transaction.originalTransactionId === "string" && transaction.originalTransactionId.trim();
  const hasReason = typeof transaction.correctionReason === "string" && transaction.correctionReason.trim();
  const passed = Boolean(hasId && hasReason);
  return { passed, ruleCode: "RULE-05",
    message: passed ? "Correction is traceable." : "A correction must include originalTransactionId and correctionReason." };
};
