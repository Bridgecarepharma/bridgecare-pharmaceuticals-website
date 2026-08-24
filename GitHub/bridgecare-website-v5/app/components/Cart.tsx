'use client';

import Image from 'next/image';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';

type Product = {
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  image: string;
};

type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  addItem: (product: Product) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'bridgecare-cart-v2';
const LEGACY_STORAGE_KEY = 'bridgecare-cart-v1';
const CHECKOUT_URL = 'https://paystack.shop/pay/btzq7yqk7p';
const MAX_QUANTITY = 20;

const formatNaira = (value: number) => `₦${value.toLocaleString('en-US')}`;

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.slug === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.priceLabel === 'string' &&
    typeof item.image === 'string' &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(STORAGE_KEY) ??
        window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(isCartItem).map((item) => ({
            ...item,
            quantity: Math.min(item.quantity, MAX_QUANTITY),
          })));
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, [items, ready]);

  const announce = useCallback((message: string) => {
    setAnnouncement('');
    window.setTimeout(() => setAnnouncement(message), 10);
  }, []);

  const addItem = useCallback(
    (product: Product) => {
      setItems((current) => {
        const existing = current.find((item) => item.slug === product.slug);
        return existing
          ? current.map((item) =>
              item.slug === product.slug
                ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
                : item,
            )
          : [...current, { ...product, quantity: 1 }];
      });
      announce(`${product.name} added to your cart.`);
      setOpen(true);
    },
    [announce],
  );

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.slug !== slug)
        : current.map((item) =>
            item.slug === slug
              ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }
              : item,
          ),
    );
  }, []);

  const removeItem = useCallback(
    (slug: string) => {
      const productName = items.find((item) => item.slug === slug)?.name;
      setItems((current) => current.filter((item) => item.slug !== slug));
      if (productName) announce(`${productName} removed from your cart.`);
    },
    [announce, items],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    announce('Your cart has been cleared.');
  }, [announce]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      open,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      setOpen,
    }),
    [items, count, subtotal, open, addItem, setQuantity, removeItem, clearCart],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <div className="cartLiveRegion" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </CartContext.Provider>
  );
}

function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('Cart components must be inside CartProvider');
  return value;
}

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      className="cartButton"
      onClick={() => setOpen(true)}
      aria-label={`Open cart with ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <ShoppingCart size={19} />
      <span>Cart</span>
      {count > 0 && <b aria-hidden="true">{count}</b>}
    </button>
  );
}

export function AddToCartButton({
  product,
  className = 'addCart',
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      className={`${className}${added ? ' added' : ''}`}
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? <Check size={17} /> : <ShoppingCart size={17} />}
      {added ? 'Added' : 'Add to cart'}
    </button>
  );
}

function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    open,
    setOpen,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      openerRef.current?.focus();
    };
  }, [open, setOpen]);

  return (
    <>
      <div
        className={`cartBackdrop ${open ? 'show' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`cartDrawer ${open ? 'show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!open}
      >
        <div className="cartHeader">
          <div>
            <span>Your basket</span>
            <h2 id="cart-title">
              {count} {count === 1 ? 'item' : 'items'}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
          >
            <X />
          </button>
        </div>

        {items.length > 0 && (
          <div className="cartUtilityBar">
            <span>Secure combined checkout</span>
            <button type="button" onClick={clearCart}>Clear cart</button>
          </div>
        )}

        <div className="cartItems">
          {items.length === 0 ? (
            <div className="emptyCart">
              <div className="emptyCartIcon"><ShoppingBag size={38} /></div>
              <h3>Your cart is empty</h3>
              <p>Add any Bridgecare product to begin your order.</p>
              <button type="button" onClick={() => setOpen(false)}>Continue shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div className="cartItem" key={item.slug}>
                <div className="cartThumb">
                  <Image src={item.image} alt="" width={110} height={90} />
                </div>
                <div className="cartItemInfo">
                  <h3>{item.name}</h3>
                  <div className="cartPriceRow">
                    <strong>{item.priceLabel}</strong>
                    <span>{formatNaira(item.price * item.quantity)}</span>
                  </div>
                  <div className="qtyControl" aria-label={`Quantity for ${item.name}`}>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      aria-label={`Reduce ${item.name} quantity`}
                    >
                      <Minus size={15} />
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      disabled={item.quantity >= MAX_QUANTITY}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="removeItem"
                  onClick={() => removeItem(item.slug)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cartFooter">
            <div className="subtotal">
              <span>Estimated subtotal</span>
              <strong>{formatNaira(subtotal)}</strong>
            </div>
            <p>Final quantities and delivery details are confirmed during secure checkout.</p>
            <a href={CHECKOUT_URL} target="_blank" rel="noreferrer">
              Proceed to checkout <ArrowRight size={18} />
            </a>
            <button type="button" className="continueShopping" onClick={() => setOpen(false)}>
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
