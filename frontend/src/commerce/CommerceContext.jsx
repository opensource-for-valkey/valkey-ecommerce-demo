import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { api, setAuthToken } from "./api";

const CommerceContext = createContext(null);

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used inside CommerceProvider");
  return context;
};

export const CommerceProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");

  const notify = useCallback((message, tone = "success") => {
    setToast({ message, tone, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const refreshCart = useCallback(async () => {
    const next = await api.cart();
    setCart(next);
    return next;
  }, []);

  const refreshWishlist = useCallback(async () => {
    const response = await api.wishlist();
    setWishlist(response.data || []);
    return response.data || [];
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [health] = await Promise.all([
          api.health(),
          refreshCart(),
          refreshWishlist()
        ]);
        setApiStatus(health.valkey?.mode || "online");

        if (window.localStorage.getItem("vc_token")) {
          try {
            const profile = await api.me();
            setUser(profile.user);
          } catch (_error) {
            setAuthToken(null);
          }
        }
      } catch (error) {
        setApiStatus("offline");
        notify(error.message, "error");
      }
    };

    bootstrap();
  }, [notify, refreshCart, refreshWishlist]);

  const addToCart = useCallback(
    async (productId, quantity = 1, variantId) => {
      const next = await api.addCartItem(productId, quantity, variantId);
      setCart(next);
      notify("Added to cart");
      return next;
    },
    [notify]
  );

  const updateCartItem = useCallback(async (productId, quantity, variantId) => {
    const next = await api.updateCartItem(productId, quantity, variantId);
    setCart(next);
    return next;
  }, []);

  const removeCartItem = useCallback(
    async (productId, variantId) => {
      const next = await api.removeCartItem(productId, variantId);
      setCart(next);
      notify("Removed from cart", "neutral");
      return next;
    },
    [notify]
  );

  const applyCoupon = useCallback(
    async (code) => {
      const next = await api.applyCoupon(code);
      setCart(next);
      notify("Coupon applied");
      return next;
    },
    [notify]
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      const exists = wishlist.some((item) => item.id === productId);
      const response = exists
        ? await api.removeWishlist(productId)
        : await api.addWishlist(productId);
      setWishlist(response.data || []);
      notify(exists ? "Removed from wishlist" : "Saved to wishlist", "neutral");
    },
    [notify, wishlist]
  );

  const login = useCallback(
    async (payload) => {
      const session = await api.login(payload);
      setAuthToken(session.token);
      setUser(session.user);
      await Promise.all([refreshCart(), refreshWishlist()]);
      notify(`Welcome back, ${session.user.name}`);
      return session.user;
    },
    [notify, refreshCart, refreshWishlist]
  );

  const register = useCallback(
    async (payload) => {
      const session = await api.register(payload);
      setAuthToken(session.token);
      setUser(session.user);
      notify(`Welcome, ${session.user.name}`);
      return session.user;
    },
    [notify]
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setAuthToken(null);
      setUser(null);
      notify("Signed out", "neutral");
    }
  }, [notify]);

  const checkout = useCallback(
    async (payload) => {
      const response = await api.checkout(payload);
      await refreshCart();
      notify("Order placed successfully");
      return response.data;
    },
    [notify, refreshCart]
  );

  const value = useMemo(
    () => ({
      apiStatus,
      user,
      cart,
      wishlist,
      toast,
      notify,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateCartItem,
      removeCartItem,
      applyCoupon,
      toggleWishlist,
      login,
      register,
      logout,
      checkout,
      setUser
    }),
    [
      addToCart,
      apiStatus,
      applyCoupon,
      cart,
      checkout,
      login,
      logout,
      notify,
      refreshCart,
      refreshWishlist,
      register,
      removeCartItem,
      toast,
      toggleWishlist,
      updateCartItem,
      user,
      wishlist
    ]
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
      {toast && (
        <div className={`vc-toast vc-toast--${toast.tone}`} role="status">
          {toast.message}
        </div>
      )}
    </CommerceContext.Provider>
  );
};

