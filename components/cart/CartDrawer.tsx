"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  priceKobo: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalKobo: number;

  add: (item: Omit<CartItem, "quantity">) => void;
  buyNow: (item: Omit<CartItem, "quantity">) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const raw = localStorage.getItem("bridgecare-cart");
        const saved: CartItem[] = raw ? JSON.parse(raw) : [];

        try {
          const response = await fetch("/api/products/prices", {
            cache: "no-store",
          });

          const data = await response.json();

          if (active) {
            setItems(
              saved.map((item) => ({
                ...item,
                priceKobo:
                  data?.prices?.[item.slug] ?? item.priceKobo,
              }))
            );
          }
        } catch {
          if (active) {
            setItems(saved);
          }
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(
        "bridgecare-cart",
        JSON.stringify(items)
      );
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,

      count: items.reduce(
        (total, item) => total + item.quantity,
        0
      ),

      subtotalKobo: items.reduce(
        (total, item) =>
          total + item.priceKobo * item.quantity,
        0
      ),

      add: (item: Omit<CartItem, "quantity">) => {
        setItems((current) => {
          const found = current.find(
            (existing) => existing.slug === item.slug
          );

          if (found) {
            return current.map((existing) =>
              existing.slug === item.slug
                ? {
                    ...existing,
                    quantity: Math.min(
                      20,
                      existing.quantity + 1
                    ),
                  }
                : existing
            );
          }

          return [
            ...current,
            {
              ...item,
              quantity: 1,
            },
          ];
        });

        // Open cart drawer automatically
        setIsCartOpen(true);
      },

      buyNow: (item: Omit<CartItem, "quantity">) => {
        setItems([
          {
            ...item,
            quantity: 1,
          },
        ]);
      },

      remove: (slug: string) => {
        setItems((current) =>
          current.filter((item) => item.slug !== slug)
        );
      },

      setQuantity: (slug: string, quantity: number) => {
        setItems((current) =>
          current.map((item) =>
            item.slug === slug
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(20, quantity)
                  ),
                }
              : item
          )
        );
      },

      clear: () => {
        setItems([]);
      },

      isCartOpen,

      openCart: () => {
        setIsCartOpen(true);
      },

      closeCart: () => {
        setIsCartOpen(false);
      },
    }),
    [items, isCartOpen]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return value;
}