import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./helper/RouteScrollToTop', () => () => null);
jest.mock('./helper/PhosphorIconInit', () => () => null);
jest.mock('./pages/HomePageOne', () => () => <main>Valkey ecommerce storefront</main>);
jest.mock('./pages/HomePageTwo', () => () => null);
jest.mock('./pages/HomePageThree', () => () => null);
jest.mock('./pages/ShopPage', () => () => null);
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
  render(<App />);
  expect(screen.getByText(/Valkey ecommerce storefront/i)).toBeInTheDocument();
});
