import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
  global.fetch = vi.fn((url) => {
    const payload = String(url).includes('/health')
      ? { status: 'ok', valkey: { mode: 'memory' } }
      : String(url).includes('/wishlist')
        ? { data: [] }
        : { identity: 'test', items: [], totals: { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 } };

    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(payload)
    });
  });
});

test('renders the VAL-HYD storefront', async () => {
  render(<App />);
  expect(screen.getAllByText(/VAL-HYD/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('search')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText(/memory/i)).toBeInTheDocument());
});
