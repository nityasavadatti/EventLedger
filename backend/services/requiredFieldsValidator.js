const { isRuleEnabled } = require("../utils/ruleConfig");
const REQUIRED_FIELDS = ["transactionId","eventId","category","amount","type","date","description","createdBy"];
function validateRequiredFields(transaction = {}) {
  if (!isRuleEnabled("RULE-04")) return { passed: true, skipped: true };
  const missingFields = REQUIRED_FIELDS.filter(key => transaction[key] === undefined ||
    transaction[key] === null || (typeof transaction[key] === "string" && !transaction[key].trim()));
  return { passed: missingFields.length === 0, ruleCode: "RULE-04", missingFields,
    message: missingFields.length ? `Missing required fields: ${missingFields.join(", ")}.` : "All required fields are present." };
}
module.exports = { validateRequiredFields, REQUIRED_FIELDS };
