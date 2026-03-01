import React, { createContext, useContext, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { auth, wishlist_ids } = usePage().props;

    const [wishlistIds, setWishlistIds] = useState(wishlist_ids || []);

    const isWishlisted = (productId) => wishlistIds.includes(productId);

    const toggle = (product) => {
        if (!auth?.user) {
            toast.error('Silakan login untuk menyimpan ke wishlist');
            router.visit(route('login'));
            return;
        }

        const alreadyWishlisted = isWishlisted(product.id);

        // Optimistic update
        setWishlistIds(prev =>
            alreadyWishlisted
                ? prev.filter(id => id !== product.id)
                : [...prev, product.id]
        );

        router.post(route('user.wishlist.toggle', product.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                // Revert on error
                setWishlistIds(prev =>
                    alreadyWishlisted
                        ? [...prev, product.id]
                        : prev.filter(id => id !== product.id)
                );
                toast.error('Gagal mengubah wishlist');
            },
        });
    };

    const wishlistCount = wishlistIds.length;

    return (
        <WishlistContext.Provider value={{ isWishlisted, toggle, wishlistCount, wishlistIds }}>
            {children}
        </WishlistContext.Provider>
    );
};
