import React from 'react';
import { useCart } from '@/Context/CartContext';
import { Link } from '@inertiajs/react';

export default function CartDrawer() {
    const { 
        cartItems, 
        updateQuantity, 
        removeFromCart, 
        cartTotal, 
        isCartOpen, 
        setIsCartOpen,
        clearCart,
        cartCount
    } = useCart();

    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    // State for selected items
    const [selectedItems, setSelectedItems] = React.useState([]);

    // Update selected items when cartItems changes (remove stale IDs)
    React.useEffect(() => {
        if (cartItems.length > 0) {
            // Optional: Auto-select newly added items or keep selection?
            // For now, let's keep valid selected IDs
            setSelectedItems(prev => prev.filter(id => cartItems.find(item => item.id === id)));
        } else {
            setSelectedItems([]);
        }
    }, [cartItems]);

    // Handle Checkbox Toggle
    const toggleSelect = (id) => {
        setSelectedItems(prev => 
            prev.includes(id) 
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    // Handle Select All
    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.id));
        }
    };

    // Calculate subtotal for SELECTED items
    const selectedTotal = cartItems
        .filter(item => selectedItems.includes(item.id))
        .reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;
        
        // Use router.post per user request
        setIsCartOpen(false);
        // We use inertia router to visit the checkout page via POST
        // This relies on the backend accepting POST on /checkout
        // and rendering the page with filtered items.
        // We import router from inertia
        // Wait, Link doesn't support Method POST easily for navigation with data body essentially acting like a form submission
        // We should use router.visit or router.post
        
        // We need to import router if not imported.
        // But we are in a component. imports are at top.
        // We already have Link from @inertiajs/react.
        // Let's assume router is available or use Link as="button" method="post" data={{cart_ids: selectedItems}} 
        // ACTUALLY, Link method="post" acts as a form submit and expects a redirect back usually, NOT a page render response unless it's an Inertia visit.
        // Inertia visit with method: 'post' works fine for rendering pages.
    };

    if (!isCartOpen) return null;

    return (
        <div className="relative z-[60]">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer Panel */}
            <div className="fixed inset-y-0 right-0 z-[70] flex w-full md:max-w-md pointer-events-none">
                <div className="pointer-events-auto w-full flex flex-col bg-white shadow-xl transform transition-transform duration-300 ease-in-out h-full">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-gray-900">Keranjang ({cartCount})</h2>
                        </div>
                        <button 
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 -mr-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <span className="sr-only">Close panel</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {cartItems.length > 0 ? (
                            <>
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                    <input 
                                        type="checkbox" 
                                        checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Pilih Semua</span>
                                </div>
                                <ul className="space-y-4">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="flex gap-4">
                                            {/* Checkbox */}
                                            <div className="flex items-center">
                                                 <input 
                                                    type="checkbox" 
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => toggleSelect(item.id)}
                                                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </div>

                                            {/* Image */}
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3 className="line-clamp-2 pr-4 text-sm">{item.name}</h3>
                                                        <p className="ml-4 font-bold text-indigo-600 sm:text-gray-900">
                                                            {formatPrice(item.price)}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500">{item.category?.name || item.category}</p>
                                                </div>
                                                
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    {/* Qty Controls */}
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-2 font-medium text-gray-900 bg-gray-50">{item.qty}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1 text-xs"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <div className="p-4 bg-gray-100 rounded-full mb-4">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-lg font-medium">Keranjang masih kosong</p>
                                <button 
                                    onClick={() => setIsCartOpen(false)}
                                    className="mt-4 text-indigo-600 font-medium hover:underline"
                                >
                                    Mulai Belanja
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-100 px-4 py-4 sm:px-6 bg-gray-50">
                            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                                <p>Subtotal ({selectedItems.length} item)</p>
                                <p>{formatPrice(selectedTotal)}</p>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500 mb-4">
                                Belum termasuk ongkos kirim.
                            </p>
                            <div className="grid gap-3">
                                <Link
                                    href={route('user.checkout')}
                                    method="post"
                                    data={{ cart_ids: selectedItems }}
                                    as="button"
                                    onClick={(e) => {
                                        if (selectedItems.length === 0) {
                                            e.preventDefault();
                                            alert('Pilih minimal 1 produk untuk checkout.');
                                            return;
                                        }
                                        setIsCartOpen(false);
                                    }}
                                    disabled={selectedItems.length === 0}
                                    className={`flex items-center justify-center w-full rounded-xl border border-transparent px-6 py-3 text-base font-bold text-white shadow-sm transition-colors ${
                                        selectedItems.length === 0 
                                            ? 'bg-gray-300 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                >
                                    Checkout Now
                                </Link>
                                <button
                                     onClick={() => setIsCartOpen(false)}
                                    className="flex items-center justify-center w-full rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                    Lanjut Belanja
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
