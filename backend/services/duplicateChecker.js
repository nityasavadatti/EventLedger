const { isRuleEnabled } = require("../utils/ruleConfig");
const norm = value => String(value ?? "").trim().toLowerCase();
module.exports = function findPossibleDuplicate(transaction = {}, existingTransactions = []) {
  if (!isRuleEnabled("RULE-06")) return { warning: false, skipped: true };
  const duplicate = existingTransactions.find(item =>
    (item.transactionId && item.transactionId === transaction.transactionId) ||
    (norm(item.eventId) === norm(transaction.eventId) &&
     norm(item.category) === norm(transaction.category) &&
     Number(item.amount) === Number(transaction.amount) &&
     norm(item.type) === norm(transaction.type) &&
     norm(item.date) === norm(transaction.date) &&
     norm(item.description) === norm(transaction.description))
  );
  return { warning: Boolean(duplicate), ruleCode: "RULE-06",
    possibleDuplicateTransactionId: duplicate?.transactionId || null,
    message: duplicate ? "Possible duplicate transaction detected. Please review before saving." : "No matching duplicate found." };
};
