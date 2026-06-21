import { render, screen } from '@testing-library/react';
import { ShopMindProvider } from './providers/ShopMindProvider';

test('renders ShopMind provider content', () => {
  render(
    <ShopMindProvider>
      <div>ShopMind AI</div>
    </ShopMindProvider>
  );
  expect(screen.getByText(/ShopMind AI/i)).toBeInTheDocument();
});
