```js
import { hybridSearch, getByName } from "./search.js";

/**
 * Simple planner that fans out to three zoology agents.
 * @param {string} query
 * @returns {object} responses
 */
export async function runPlanner(query) {
  const grounding = hybridSearch(query);
  return {
    grounding,
    habitat: await HabitatAnalystAgent(query, grounding),
    behavior: await SpeciesBehaviorAgent(query, grounding),
    conservation: await ConservationAdvisorAgent(query, grounding)
  };
}

/**
 * HabitatAnalystAgent
 * @param {string} query
 * @param {Array} grounding
 */
export async function HabitatAnalystAgent(query, grounding) {
  // TODO: improve habitat/environmental parameter inference.
  const ref = grounding[0]?.item || getByName(query) || null;
  return {
    agent: "HabitatAnalystAgent",
    color: "#1E90FF",
    content: ref
      ? `Typical habitat: ${ref.habitat}. Region: ${ref.region}. Evidence: IUCN ${ref.iucnId}, GBIF ${ref.gbifId}.`
      : "No habitat match found.",
    evidence: ref ? [ref.commonName] : []
  };
}

/**
 * SpeciesBehaviorAgent
 * @param {string} query
 * @param {Array} grounding
 */
export async function SpeciesBehaviorAgent(query, grounding) {
  // TODO: expand behavior/diet/social reasoning and multi-species comparisons.
  const ref = grounding[0]?.item || getByName(query) || null;
  return {
    agent: "SpeciesBehaviorAgent",
    color: "#32CD32",
    content: ref
      ? `Behavior: ${ref.behavior}. Diet: ${ref.diet}. Evidence: ${ref.commonName} (${ref.scientificName}).`
      : "No behavior match found.",
    evidence: ref ? [ref.commonName] : []
  };
}

/**
 * ConservationAdvisorAgent
 * @param {string} query
 * @param {Array} grounding
 */
export async function ConservationAdvisorAgent(query, grounding) {
  // TODO: add threat analysis and recommended actions with citations.
  const ref = grounding[0]?.item || getByName(query) || null;
  return {
    agent: "ConservationAdvisorAgent",
    color: "#FF6347",
    content: ref
      ? `Status: ${ref.iucnStatus}. Cite: IUCN ${ref.iucnId}, GBIF ${ref.gbifId}.`
      : "No conservation data found.",
    evidence: ref ? [ref.commonName] : []
  };
}
```
