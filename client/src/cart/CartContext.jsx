import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CART_KEY = "globalstores_cart";
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function itemKey(serviceId, duration) {
  return `${serviceId}:${duration}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart());

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((service, duration, unitPrice) => {
    const key = itemKey(service.id, duration);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + 1, unitPrice } : i,
        );
      }
      return [
        ...prev,
        {
          key,
          serviceId: service.id,
          nameEn: service.nameEn,
          nameAr: service.nameAr,
          accent: service.accent,
          duration,
          unitPrice,
          qty: 1,
        },
      ];
    });
  }, []);

  const setQty = useCallback((key, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.key !== key);
      return prev.map((i) => (i.key === key ? { ...i, qty } : i));
    });
  }, []);

  const increment = useCallback((key) => {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)),
    );
  }, []);

  const decrement = useCallback((key) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getQty = useCallback(
    (serviceId, duration) => {
      const found = items.find((i) => i.key === itemKey(serviceId, duration));
      return found?.qty || 0;
    },
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      setQty,
      increment,
      decrement,
      removeItem,
      clearCart,
      getQty,
      totalItems,
      totalPrice,
      itemKey,
    }),
    [
      items,
      addItem,
      setQty,
      increment,
      decrement,
      removeItem,
      clearCart,
      getQty,
      totalItems,
      totalPrice,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
