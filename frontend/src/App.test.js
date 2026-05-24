import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./helper/RouteScrollToTop', () => () => null);
jest.mock('./helper/PhosphorIconInit', () => () => null);
jest.mock('./pages/HomePageOne', () => () => <main>Valkey ecommerce storefront</main>);
jest.mock('./pages/HomePageTwo', () => () => null);
jest.mock('./pages/HomePageThree', () => () => null);
jest.mock('./pages/ShopPage', () => () => null);
jest.mock('./pages/CatalogPage', () => () => <main>Catalog challenge route</main>);
jest.mock('./pages/GrowthPage', () => () => <main>Growth challenge route</main>);
jest.mock('./pages/SemanticSearchPage', () => () => <main>Semantic search challenge route</main>);
jest.mock('./pages/AnalyticsPage', () => () => <main>Analytics challenge route</main>);
jest.mock('./pages/ObservabilityPage', () => () => <main>Observability challenge route</main>);
jest.mock('./pages/DeliveryPage', () => () => <main>Delivery challenge route</main>);
jest.mock('./pages/RateLimitPage', () => () => <main>Rate limit challenge route</main>);
jest.mock('./pages/RecommendationsPage', () => () => <main>Recommendations challenge route</main>);
jest.mock('./pages/AgenticSearchPage', () => () => <main>Agentic search challenge route</main>);
jest.mock('./pages/IntegrationsPage', () => () => <main>Integrations route</main>);
jest.mock('./pages/ProductDetailsPageOne', () => () => null);
jest.mock('./pages/ProductDetailsPageTwo', () => () => null);
jest.mock('./pages/CartPage', () => () => null);
jest.mock('./pages/CheckoutPage', () => () => null);
jest.mock('./pages/AccountPage', () => () => null);
jest.mock('./pages/BlogPage', () => () => null);
jest.mock('./pages/BlogDetailsPage', () => () => null);
jest.mock('./pages/ContactPage', () => () => null);
jest.mock('./pages/VendorPage', () => () => null);
jest.mock('./pages/VendorDetailsPage', () => () => null);
jest.mock('./pages/VendorTwoPage', () => () => null);
jest.mock('./pages/VendorTwoDetailsPage', () => () => null);
jest.mock('./pages/BecomeSellerPage', () => () => null);
jest.mock('./pages/WishlistPage', () => () => null);

test('renders the ecommerce storefront', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(screen.getByText(/Valkey ecommerce storefront/i)).toBeInTheDocument();
});

test('routes to semantic search challenge page', () => {
  window.history.pushState({}, '', '/semantic-search');
  render(<App />);
  expect(screen.getByText(/Semantic search challenge route/i)).toBeInTheDocument();
});

test('routes to catalog challenge page', () => {
  window.history.pushState({}, '', '/catalog');
  render(<App />);
  expect(screen.getByText(/Catalog challenge route/i)).toBeInTheDocument();
});

test('routes to all remaining challenge pages', () => {
  const routes = [
    ['/growth', /Growth challenge route/i],
    ['/delivery', /Delivery challenge route/i],
    ['/ratelimit', /Rate limit challenge route/i],
    ['/recommendations', /Recommendations challenge route/i],
    ['/agentic-search', /Agentic search challenge route/i],
    ['/integrations', /Integrations route/i],
  ];

  routes.forEach(([path, matcher]) => {
    window.history.pushState({}, '', path);
    const { unmount } = render(<App />);
    expect(screen.getByText(matcher)).toBeInTheDocument();
    unmount();
  });
});

test('routes to analytics challenge page', () => {
  window.history.pushState({}, '', '/analytics');
  render(<App />);
  expect(screen.getByText(/Analytics challenge route/i)).toBeInTheDocument();
});

test('routes to observability challenge page', () => {
  window.history.pushState({}, '', '/observability');
  render(<App />);
  expect(screen.getByText(/Observability challenge route/i)).toBeInTheDocument();
});
