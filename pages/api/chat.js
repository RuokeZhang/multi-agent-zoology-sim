```js
import { runPlanner } from "../../lib/agents.js";

/**
 * API route for single-turn multi-agent responses.
 * Expects { query: string } in body.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ status: "ok", message: "Send POST with {query}" });
  }
  const { query } = req.body || {};
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "query is required" });
  }
  // TODO: add session history persistence and admin auth.
  const result = await runPlanner(query);
  res.status(200).json({ query, ...result });
}
```
