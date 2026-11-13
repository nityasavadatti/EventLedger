# EventLedger – Engine 2: Logic & Rule

Runnable Node.js/Express starter for your assigned Logic & Rule engine.

## Included
- RULE-01: Block category allocations above approved event budget.
- RULE-02: Warn when category spending exceeds allocation.
- RULE-03: Reject missing, non-numeric, zero or negative amounts.
- RULE-04: Reject transactions missing required fields.
- RULE-05: Require original transaction ID and reason for corrections.
- RULE-06: Flag possible duplicates for human review; never auto-delete.
- Calculations: recorded cash balance, unspent approved budget, category variance.

## Run in VS Code
1. Extract the ZIP.
2. Open `EventLedger_Engine2_Starter` in VS Code.
3. Open Terminal > New Terminal.
4. Run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
5. Visit `http://localhost:4000/api/health`.
6. Run tests in another terminal: `npm test`.

Requires Node.js 18+ (20 LTS recommended).

## API: validate a transaction
POST `http://localhost:4000/api/rules/validate-transaction`
Header: `Content-Type: application/json`

```json
{
  "transaction": {
    "transactionId": "TXN-001",
    "eventId": "EVT-001",
    "category": "Food",
    "amount": 2000,
    "type": "expense",
    "date": "2026-11-06",
    "description": "Food purchase",
    "createdBy": "ORG-001"
  },
  "event": {
    "approvedBudget": 50000,
    "categoryBudgets": {
      "Food": 15000,
      "Decoration": 10000,
      "Prizes": 15000,
      "Other": 10000
    }
  },
  "existingTransactions": [],
  "categoryExpenses": {"Food": 5000}
}
```

A blocking rule failure returns HTTP 422 and `valid: false`. A warning can be returned with `valid: true` and status `VALID_WITH_WARNINGS`.

## API: financial calculations
POST `http://localhost:4000/api/rules/calculate`

```json
{
  "approvedBudget": 50000,
  "totalIncome": 45000,
  "totalExpenses": 32000,
  "categoryBudgets": {"Food": 15000, "Decoration": 10000},
  "categoryExpenses": {"Food": 17000, "Decoration": 8000}
}
```
Expected: cash balance 13000, unspent budget 18000, Food variance 2000.

## Important integration note
This starter runs in local demo mode by default. It does not yet read/write your team's MongoDB event or transaction collections. The `Rule` Mongoose model is included as a starting point, but the final schema, rule configuration storage and API contract must be agreed with Engine 1 and Engine 3 before integration. The active starter rule register is in `backend/config/rules.json`; it keeps rule definitions out of the validation functions.

Confirm all rule names and exact actions against your approved Gate 1/Gate 2 documents before mentor submission.
