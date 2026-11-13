const fs = require("node:fs");
const path = require("node:path");
const file = path.join(__dirname, "..", "config", "rules.json");
function getRule(code) {
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  return config.rules.find(rule => rule.code === code);
}
function isRuleEnabled(code) {
  const rule = getRule(code);
  return Boolean(rule && rule.enabled);
}
module.exports = { getRule, isRuleEnabled };
