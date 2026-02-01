import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { auth, cart } = usePage().props;
    const isAuth = !!auth?.user;

    // --- Guest Cart State (LocalStorage) ---
    const [localCartItems, setLocalCartItems] = useState(() => {
        if (typeof window === 'undefined') return [];
        const storedCart = localStorage.getItem('endUserCart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Sync Local Cart to Storage
    useEffect(() => {
        if (!isAuth) {
            localStorage.setItem('endUserCart', JSON.stringify(localCartItems));
        }
    }, [localCartItems, isAuth]);

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    // --- Actions ---

    const addToCart = (product) => {
        if (isAuth) {
            // Server-side handled by ProductCard usually, but if needed here:
            router.post(route('user.cart.store'), {
                product_id: product.id,
                qty: 1
            }, { preserveScroll: true });
        } else {
            setLocalCartItems(prev => {
                const existingItem = prev.find(item => item.id === product.id);
                if (existingItem) {
                    return prev.map(item => 
                        item.id === product.id 
                            ? { ...item, qty: item.qty + 1 } 
                            : item
                    );
                }
                const price = product.price || product.sell_price || 0;
                return [...prev, { ...product, price: price, qty: 1 }];
            });
        }
    };

    const removeFromCart = (id) => {
        if (isAuth) {
            // id is cart_id here
            router.delete(route('user.cart.destroy', id), {
                preserveScroll: true
            });
        } else {
            setLocalCartItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const updateQuantity = (id, delta) => {
        if (isAuth) {
             // Find current qty to calculate new qty
             // id is cart_id
             const item = cart?.items?.find(i => i.id === id);
             if (!item) return;

             const newQty = item.qty + delta;
             if (newQty < 1) return;

             router.patch(route('user.cart.update', id), {
                 qty: newQty
             }, { preserveScroll: true });
        } else {
            setLocalCartItems(prev => prev.map(item => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.qty + delta);
                    return { ...item, qty: newQty };
                }
                return item;
            }));
        }
    };

    const clearCart = () => {
        if (!isAuth) {
            setLocalCartItems([]);
        }
        // Server cart clear not implemented yet or handled by checkout
    };

    // --- Derived State ---
    const cartItems = isAuth ? (cart?.items || []) : localCartItems;
    
    const cartCount = isAuth 
        ? (cart?.count || 0) 
        : localCartItems.reduce((acc, item) => acc + item.qty, 0);
        
    const cartTotal = isAuth
        ? (cart?.total || 0)
        : localCartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};
