```jsx
import { useState } from "react";

const agentTabs = [
  { key: "habitat", label: "HabitatAnalystAgent", color: "#1E90FF" },
  { key: "behavior", label: "SpeciesBehaviorAgent", color: "#32CD32" },
  { key: "conservation", label: "ConservationAdvisorAgent", color: "#FF6347" }
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("habitat");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const json = await res.json();
      setResponse(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activeMsg =
    response && response[active]
      ? response[active]
      : { content: "No response yet", evidence: [] };

  return (
    <main style={styles.container}>
      <h1>Zoology Multi-Agent Explorer</h1>
      <div style={styles.inputRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about a species, habitat, or behavior..."
          style={styles.input}
        />
        <button onClick={submit} disabled={loading} style={styles.button}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      <div style={styles.tabRow}>
        {agentTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            style={{
              ...styles.tab,
              borderBottom:
                active === tab.key ? `3px solid ${tab.color}` : "3px solid transparent"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.chatArea}>
        {response && (
          <div style={{ ...styles.bubble, borderColor: activeMsg.color || "#ccc" }}>
            <div style={{ fontWeight: "bold", color: activeMsg.color || "#000" }}>
              {agentTabs.find((a) => a.key === active)?.label}
            </div>
            <div>{activeMsg.content}</div>
            {activeMsg.evidence?.length ? (
              <div style={styles.evidence}>
                Evidence: {activeMsg.evidence.join(", ")}
              </div>
            ) : null}
          </div>
        )}
        {!response && <div style={styles.placeholder}>Awaiting a question...</div>}
      </div>

      <div style={styles.section}>
        <h2>Grounding Results</h2>
        {response?.grounding?.length ? (
          <ul>
            {response.grounding.map((g, idx) => (
              <li key={idx}>
                {g.item.commonName} ({g.item.scientificName}) — score {g.score.toFixed(2)}; IUCN {g.item.iucnId}, GBIF {g.item.gbifId}
              </li>
            ))}
          </ul>
        ) : (
          <p>No matches yet.</p>
        )}
      </div>

      <div style={styles.section}>
        <h2>Planned Extensions</h2>
        <ul>
          <li>Interactive species comparison view (TODO).</li>
          <li>Static biome visualization per species (TODO).</li>
          <li>Quiz mode from dataset (TODO).</li>
          <li>Session history per user (TODO).</li>
          <li>Admin upload/edit + re-index (TODO).</li>
        </ul>
      </div>
    </main>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "system-ui, sans-serif",
    maxWidth: "900px",
    margin: "0 auto"
  },
  inputRow: { display: "flex", gap: "0.5rem", marginBottom: "1rem" },
  input: { flex: 1, padding: "0.6rem", fontSize: "1rem" },
  button: { padding: "0.6rem 1rem", fontSize: "1rem", cursor: "pointer" },
  tabRow: { display: "flex", gap: "0.5rem", marginBottom: "1rem" },
  tab: {
    flex: 1,
    padding: "0.6rem",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    cursor: "pointer"
  },
  chatArea: {
    minHeight: "150px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem"
  },
  bubble: {
    borderLeft: "4px solid #ccc",
    paddingLeft: "0.75rem"
  },
  placeholder: { color: "#9ca3af" },
  evidence: { marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280" },
  section: { marginTop: "1.5rem" }
};
```
