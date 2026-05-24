// Example React/JavaScript integration for the hackathon demo.
// Show `source`, `responseTime`, and a "Powered by Valkey Cache" badge when source is valkey-cache.

export async function agentSearch(query) {
  const response = await fetch("http://localhost:5005/agent-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Search request failed");
  }

  return response.json();
}

export async function getTrendingSearches() {
  const response = await fetch("http://localhost:5005/trending");

  if (!response.ok) {
    throw new Error("Trending request failed");
  }

  return response.json();
}

// Usage:
// const result = await agentSearch("gaming laptop");
// console.log(result.source); // "database" first, "valkey-cache" on repeat
// console.log(result.responseTime);
// console.log(result.data);
