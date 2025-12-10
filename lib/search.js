```js
import data from "../data/zoology.json";

/**
 * Perform hybrid keyword + naive semantic search (bag-of-words overlap).
 * @param {string} query
 * @returns {Array} ranked results with score
 */
export function hybridSearch(query) {
  const q = query.toLowerCase();
  return data
    .map((item) => {
      const text = [
        item.commonName,
        item.scientificName,
        item.habitat,
        item.diet,
        item.behavior,
        item.region,
        item.notes
      ]
        .join(" ")
        .toLowerCase();
      const keywords = q.split(/\s+/);
      const hits = keywords.reduce(
        (acc, kw) => acc + (text.includes(kw) ? 1 : 0),
        0
      );
      const score = hits / (keywords.length || 1);
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/**
 * Retrieve item by name (common or scientific).
 * @param {string} name
 * @returns {object|null}
 */
export function getByName(name) {
  const lower = name.toLowerCase();
  return (
    data.find(
      (d) =>
        d.commonName.toLowerCase() === lower ||
        d.scientificName.toLowerCase() === lower
    ) || null
  );
}
```
