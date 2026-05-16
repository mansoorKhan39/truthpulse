import { useState, useEffect } from "react";

// In dev, uses proxy to localhost:5000
// In prod, data is bundled directly
const BASE = process.env.REACT_APP_API_URL || "";

// Bundled fallback data (so app works without server too)
const FALLBACK = null; // will be set after first successful fetch

export function useEDA() {
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE}/api/eda/all`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        // Fallback: load bundled JSON
        try {
          const fallback = await import("../data/eda_output.json");
          setData(fallback.default);
        } catch {
          setError(e.message);
        }
      } finally {
        setLoad(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}
