import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Receipt, Storefront, Truck, X } from "@phosphor-icons/react";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { ContentPage } from "./pages/ContentPage";

const lazyPage = (loader, exportName) =>
  lazy(() => loader().then((module) => ({ default: module[exportName] })));

const HomePage = lazyPage(() => import("./pages/HomePage"), "HomePage");
const ShopPage = lazyPage(() => import("./pages/ShopPage"), "ShopPage");
const ProductDetailsPage = lazyPage(
  () => import("./pages/ProductDetailsPage"),
  "ProductDetailsPage"
);
const CartPage = lazyPage(() => import("./pages/CartPage"), "CartPage");
const CheckoutPage = lazyPage(() => import("./pages/CheckoutPage"), "CheckoutPage");
const WishlistPage = lazyPage(() => import("./pages/WishlistPage"), "WishlistPage");
const AccountPage = lazyPage(() => import("./pages/AccountPage"), "AccountPage");
const AdminPage = lazyPage(() => import("./pages/AdminPage"), "AdminPage");

const PageFallback = () => (
  <main className="vc-page">
    <div className="vc-product-grid" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="vc-product-card vc-skeleton-card" key={index}>
          <div className="vc-skeleton vc-skeleton--image" />
          <div className="vc-skeleton vc-skeleton--line" />
          <div className="vc-skeleton vc-skeleton--line short" />
        </div>
      ))}
    </div>
  </main>
);

export const CommerceApp = () => (
  <>
    <Header />
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/product-details" element={<ProductDetailsPage />} />
        <Route path="/product-details-two" element={<ProductDetailsPage fallbackId="pulse-anc-earbuds-pro" />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/index-two" element={<HomePage />} />
        <Route path="/index-three" element={<HomePage />} />
        <Route path="/vendor" element={<ContentPage title="Vendor Network" body="Marketplace vendor workflows are represented through product vendors and admin operations." icon={Storefront} />} />
        <Route path="/vendor-details" element={<ContentPage title="Vendor Profile" body="Vendor detail pages can connect to the same catalog and analytics services." icon={Storefront} />} />
        <Route path="/vendor-two" element={<ContentPage title="Vendor Directory" body="A scalable vendor directory belongs behind the same API version and RBAC model." icon={Storefront} />} />
        <Route path="/vendor-two-details" element={<ContentPage title="Vendor Operations" body="Inventory, fulfillment, and performance signals are ready for extension." icon={Storefront} />} />
        <Route path="/become-seller" element={<ContentPage title="Become a Seller" body="Seller onboarding can be added with role elevation, verification, and catalog permissions." icon={Storefront} />} />
        <Route path="/blog" element={<ContentPage title="Commerce Journal" body="Editorial content can be served from a CMS or cached API endpoint." icon={Receipt} />} />
        <Route path="/blog-details" element={<ContentPage title="Commerce Insight" body="This route is preserved for deep links and ready for CMS-backed articles." icon={Receipt} />} />
        <Route path="/contact" element={<ContentPage title="Support" body="Customer support, returns, and fulfillment messaging can be integrated here." icon={Truck} />} />
        <Route path="*" element={<ContentPage title="Page not found" body="The route does not exist in this storefront." icon={X} />} />
      </Routes>
    </Suspense>
    <Footer />
  </>
);
