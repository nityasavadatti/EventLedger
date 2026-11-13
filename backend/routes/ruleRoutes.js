const express = require("express");
const { postValidateTransaction, postCalculate } = require("../controllers/ruleController");
const router = express.Router();
router.post("/validate-transaction", postValidateTransaction);
router.post("/calculate", postCalculate);
module.exports = router;
