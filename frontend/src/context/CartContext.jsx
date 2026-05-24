import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  addCartItem,
  applyCartCoupon,
  clearCartApi,
  getCart,
  removeCartCoupon,
  removeCartItem,
  updateCartItem,
} from "../services/valkeyApi";

const CartContext = createContext(null);

const emptySummary = {
  items: [],
  coupon: null,
  couponError: "",
  totals: {
    subtotal: 0,
    discount: 0,
    total: 0,
    count: 0,
  },
};

export function CartProvider({ children }) {
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const applySummary = useCallback((data) => {
    setSummary(data?.cart || emptySummary);
  }, []);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      applySummary(await getCart());
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [applySummary]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const runCartMutation = useCallback(
    async (operation) => {
      setMessage("");
      try {
        const data = await operation();
        applySummary(data);
        return data?.cart;
      } catch (error) {
        setMessage(error.message);
        return null;
      }
    },
    [applySummary]
  );

  const addItem = useCallback(
    (product, quantity = 1) => runCartMutation(() => addCartItem(product.id, quantity)),
    [runCartMutation]
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const nextQuantity = Number(quantity);
      if (!Number.isInteger(nextQuantity) || nextQuantity <= 0) {
        return runCartMutation(() => removeCartItem(productId));
      }
      return runCartMutation(() => updateCartItem(productId, nextQuantity));
    },
    [runCartMutation]
  );

  const removeItem = useCallback(
    (productId) => runCartMutation(() => removeCartItem(productId)),
    [runCartMutation]
  );

  const clearCart = useCallback(() => runCartMutation(() => clearCartApi()), [runCartMutation]);

  const loadDemoCart = useCallback(
    async (products) => {
      const demoProducts = products.slice(0, 2);
      let latest = await clearCart();
      for (const product of demoProducts) {
        latest = await addItem(product, 1);
      }
      return latest;
    },
    [addItem, clearCart]
  );

  const applyCoupon = useCallback(
    (code) => runCartMutation(() => applyCartCoupon(code)),
    [runCartMutation]
  );

  const removeCoupon = useCallback(
    () => runCartMutation(() => removeCartCoupon()),
    [runCartMutation]
  );

  const value = useMemo(
    () => ({
      items: summary.items,
      totals: summary.totals,
      coupon: summary.coupon,
      couponError: summary.couponError,
      loading,
      message,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      loadDemoCart,
      applyCoupon,
      removeCoupon,
      refreshCart,
    }),
    [
      addItem,
      applyCoupon,
      clearCart,
      loadDemoCart,
      loading,
      message,
      refreshCart,
      removeCoupon,
      removeItem,
      summary.coupon,
      summary.couponError,
      summary.items,
      summary.totals,
      updateQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
