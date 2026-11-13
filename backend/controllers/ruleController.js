const { validateTransaction } = require("../engines/logicRule/logicRuleEngine");
const { calculateFinancials } = require("../services/financialCalculator");
function postValidateTransaction(req, res) {
  const result = validateTransaction(req.body || {});
  return res.status(result.valid ? 200 : 422).json(result);
}
function postCalculate(req, res) {
  try { return res.status(200).json({ message: "Financial calculations completed.", ...calculateFinancials(req.body || {}) }); }
  catch (error) { return res.status(400).json({ message: error.message }); }
}
module.exports = { postValidateTransaction, postCalculate };
