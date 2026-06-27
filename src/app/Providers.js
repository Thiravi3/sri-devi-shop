"use client";

import { CartProvider } from "./CartContext";

export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
