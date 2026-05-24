const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') || '';

export async function getValkeyDashboard() {
  const res = await fetch(`${API_BASE}/api/valkey/dashboard`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Dashboard failed');
  return data;
}

export function subscribeValkeyStream(onData, onError) {
  const url = `${API_BASE}/api/valkey/stream`;
  const source = new EventSource(url);

  source.onmessage = (event) => {
    try {
      onData(JSON.parse(event.data));
    } catch (e) {
      onError?.(e);
    }
  };

  source.onerror = () => {
    onError?.(new Error('Valkey stream disconnected'));
  };

  return () => source.close();
}
