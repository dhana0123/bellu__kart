import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
  deliveryTime: number;
}

export interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  product?: CartProduct;
}

interface CartState {
  sessionId: string;
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  setSessionId: (sessionId: string) => void;
  setItems: (items: CartItem[]) => void;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  calculateTotals: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      sessionId: Math.random().toString(36).substr(2, 9),
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,

      setSessionId: (sessionId) => set({ sessionId }),

      setItems: (items) => {
        set({ items });
        get().calculateTotals();
      },

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === product.id);
        
        if (existingItem) {
          get().updateQuantity(product.id, existingItem.quantity + quantity);
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            sessionId: get().sessionId,
            productId: product.id,
            quantity,
            product
          };
          set({ items: [...items, newItem] });
          get().calculateTotals();
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter(item => item.productId !== productId) });
        get().calculateTotals();
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const { items } = get();
        set({
          items: items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          )
        });
        get().calculateTotals();
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (open) => set({ isOpen: open }),

      calculateTotals: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => {
          return sum + (parseFloat(item.product?.price || '0') * item.quantity);
        }, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        set({ total, itemCount });
      },
    }),
    {
      name: 'bellu-cart',
      partialize: (state) => ({
        sessionId: state.sessionId,
        items: state.items,
      }),
    }
  )
);
