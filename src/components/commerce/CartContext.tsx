"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  CartState, 
  AddToCartInput,
  RemoveFromCartInput,
  UpdateCartItemInput,
  SetProjectContextInput
} from '../../modules/commerce/frontend-contracts/CartContract';
import { 
  SupabaseGetCartAdapter,
  SupabaseAddToCartAdapter,
  SupabaseRemoveFromCartAdapter,
  SupabaseUpdateCartItemAdapter,
  SupabaseSetProjectContextAdapter
} from '../../modules/commerce/frontend-contracts/SupabaseCartAdapter';
import { CommandContext } from '../../contracts/base';

const getCartQuery = new SupabaseGetCartAdapter();
const addToCartCommand = new SupabaseAddToCartAdapter();
const removeFromCartCommand = new SupabaseRemoveFromCartAdapter();
const updateCartItemCommand = new SupabaseUpdateCartItemAdapter();
const setProjectContextCommand = new SupabaseSetProjectContextAdapter();

interface CartContextValue {
  cartState: CartState | null;
  isLoading: boolean;
  addToCart: (input: AddToCartInput) => Promise<void>;
  removeFromCart: (input: RemoveFromCartInput) => Promise<void>;
  updateQuantity: (input: UpdateCartItemInput) => Promise<void>;
  setProjectContext: (input: SetProjectContextInput) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartState, setCartState] = useState<CartState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = async () => {
    setIsLoading(true);
    try {
      const data = await getCartQuery.execute();
      setCartState(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCart();
  }, []);

  const addToCart = async (input: AddToCartInput) => {
    const ctx: CommandContext = { metadata: { requestId: crypto.randomUUID(), commandId: crypto.randomUUID(), idempotencyKey: crypto.randomUUID() }, channel: 'web' };
    const res = await addToCartCommand.execute(input, ctx);
    if (res.status === 'SUCCESS' && res.data) {
      setCartState(res.data);
    } else {
      throw new Error(res.error?.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (input: RemoveFromCartInput) => {
    const ctx: CommandContext = { metadata: { requestId: crypto.randomUUID(), commandId: crypto.randomUUID(), idempotencyKey: crypto.randomUUID() }, channel: 'web' };
    const res = await removeFromCartCommand.execute(input, ctx);
    if (res.status === 'SUCCESS' && res.data) {
      setCartState(res.data);
    } else {
      throw new Error(res.error?.message || 'Failed to remove from cart');
    }
  };

  const updateQuantity = async (input: UpdateCartItemInput) => {
    const ctx: CommandContext = { metadata: { requestId: crypto.randomUUID(), commandId: crypto.randomUUID(), idempotencyKey: crypto.randomUUID() }, channel: 'web' };
    const res = await updateCartItemCommand.execute(input, ctx);
    if (res.status === 'SUCCESS' && res.data) {
      setCartState(res.data);
    } else {
      throw new Error(res.error?.message || 'Failed to update quantity');
    }
  };

  const setProjectContext = async (input: SetProjectContextInput) => {
    const ctx: CommandContext = { metadata: { requestId: crypto.randomUUID(), commandId: crypto.randomUUID(), idempotencyKey: crypto.randomUUID() }, channel: 'web' };
    const res = await setProjectContextCommand.execute(input, ctx);
    if (res.status === 'SUCCESS' && res.data) {
      setCartState(res.data);
    } else {
      throw new Error(res.error?.message || 'Failed to set project context');
    }
  };

  return (
    <CartContext.Provider value={{ cartState, isLoading, addToCart, removeFromCart, updateQuantity, setProjectContext }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
