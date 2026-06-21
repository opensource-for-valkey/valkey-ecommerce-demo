import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const ShopMindContext = createContext(null);

export const ShopMindProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("shopmind_theme") === "dark");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("shopmind_user");
    return raw ? JSON.parse(raw) : { id: "user_demo", name: "Demo Shopper", role: "customer" };
  });

  useEffect(() => {
    document.documentElement.dataset.shopmindTheme = darkMode ? "dark" : "light";
    localStorage.setItem("shopmind_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      user,
      setUser
    }),
    [darkMode, user]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ShopMindContext.Provider value={value}>{children}</ShopMindContext.Provider>
    </QueryClientProvider>
  );
};

export const useShopMind = () => useContext(ShopMindContext);
