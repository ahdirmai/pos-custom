import React, {
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from "react";
import { Head, router, usePage } from "@inertiajs/react";
import axios from "axios";
import toast from "react-hot-toast";
import POSLayout from "@/Layouts/POSLayout";
import ProductGrid from "@/Components/POS/ProductGrid";
import CartPanel from "@/Components/POS/CartPanel";
import PaymentPanel from "@/Components/POS/PaymentPanel";
import CustomerSelect from "@/Components/POS/CustomerSelect";
import NumpadModal from "@/Components/POS/NumpadModal";
import HeldTransactions, {
    HoldButton,
} from "@/Components/POS/HeldTransactions";
import useBarcodeScanner from "@/Hooks/useBarcodeScanner";
import { getProductImageUrl } from "@/Utils/imageUrl";
import {
    IconUser,
    IconShoppingCart,
    IconReceipt,
    IconKeyboard,
    IconBarcode,
    IconTrash,
    IconCash,
    IconCreditCard,
    IconBuildingBank,
    IconAlertTriangle,
    IconTruck,
    IconTicket,
    IconX,
    IconMapPin,
} from "@tabler/icons-react";

const formatPrice = (value = 0) =>
    value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

export default function Index({
    carts = [],
    carts_total = 0,
    heldCarts = [],
    customers = [],
    products = [],
    categories = [],
    paymentGateways = [],
    defaultPaymentGateway = "cash",
    bankAccounts = [],
    active_vouchers = [],
}) {
    const { auth, errors, lowStockNotifications = [] } = usePage().props;

    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [addingProductId, setAddingProductId] = useState(null);
    const [removingItemId, setRemovingItemId] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [discountInput, setDiscountInput] = useState("");
    const [cashInput, setCashInput] = useState("");
    const [shippingInput, setShippingInput] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(
        defaultPaymentGateway ?? "cash"
    );
    const [payLater, setPayLater] = useState(false);
    const [dueDate, setDueDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mobileView, setMobileView] = useState("products"); // 'products' | 'cart'
    const [numpadOpen, setNumpadOpen] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [selectedBankAccount, setSelectedBankAccount] = useState(null);

    // Ref for search input to enable keyboard focus
    const searchInputRef = useRef(null);

    // Set default payment method
    useEffect(() => {
        setPaymentMethod(defaultPaymentGateway ?? "cash");
    }, [defaultPaymentGateway]);

    // Barcode scanner integration
    const handleBarcodeScan = useCallback(
        (barcode) => {
            const product = products.find(
                (p) => p.barcode?.toLowerCase() === barcode.toLowerCase()
            );

            if (product) {
                if (product.stock > 0) {
                    handleAddToCart(product);
                    toast.success(`${product.title} ditambahkan (barcode)`);
                } else {
                    toast.error(`${product.title} stok habis`);
                }
            } else {
                toast.error(`Produk tidak ditemukan: ${barcode}`);
            }
        },
        [products]
    );

    const { isScanning } = useBarcodeScanner(handleBarcodeScan, {
        enabled: true,
        minLength: 3,
    });

    const LowStockAlerts = () => null;

    // State for Voucher
    const [voucherSubtotal, setVoucherSubtotal] = useState(null); // { code, amount, type, value, target }
    const [voucherShipping, setVoucherShipping] = useState(null); // { code, amount, type, value, target }
    const [voucherCode, setVoucherCode] = useState("");
    const [checkingVoucher, setCheckingVoucher] = useState(false);
    const [showVoucherList, setShowVoucherList] = useState(false);

    // State for Shipping
    const [shippingMethod, setShippingMethod] = useState("off"); // 'off', 'manual', 'using_vendor'
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [shippingRates, setShippingRates] = useState([]);
    const [isCheckingRates, setIsCheckingRates] = useState(false);

    const handleCheckRates = async () => {
        if (!selectedCustomer) {
            toast.error("Pilih pelanggan terlebih dahulu");
            return;
        }

        if (!selectedCustomer.postal_code) {
             // Fallback logic if postal_code not directly on customer root? 
             // We just updated Customer model to have postal_code attribute.
             // But in JS key conversion, it might be camelCase 'postalCode' or snake_case 'postal_code' depending on serialization.
             // Laravel default toArray() preserves snake_case unless mapped.
             // We can check.
             toast.error("Data pelanggan tidak memiliki kode pos");
             return;
        }
        
        setIsCheckingRates(true);
        setShippingRates([]);

        try {
            // Calculate total weight (default 1000g if not set in product)
            const totalWeight = carts.reduce((acc, item) => acc + (1000 * item.qty), 0); // Temporary assumption: 1kg per item if not defined. Ideally: item.product.weight
            
            // Build items payload
            const itemsPayload = carts.map(c => ({
                name: c.product.title,
                value: c.product.sell_price,
                weight: 1000, // Hardcoded for now, or fetch from product if available
                quantity: c.qty
            }));

            const response = await axios.post(route('settings.shipping.check-rates'), {
                destination_postal_code: selectedCustomer.postal_code,
                weight: totalWeight,
                // items: itemsPayload // Controller might need update to accept items if we want exact detail
            });

            if (response.data?.rates) {
                 // Check if it was returned via flash (redirect back with Inertia) or JSON?
                 // Wait, the controller returns `back()->with(...)` which is an Inertia response.
                 // Calling it via axios will return the HTML/Inertia page content, NOT JSON data directly if it is a standard controller method returning Inertia render/redirect.
                 // We need a JSON endpoint or we need to use `router.post` and handle `onSuccess`.
                 // But `router.post` reloads the page/props. That might be okay.
                 
                 // HOWEVER, `Index.jsx` is a POS page, state reload might be jarring.
                 // Better to have a dedicated JSON endpoint for check rates.
                 // OPTION 2: Use `router.post` with `preserveState: true`.
            }
            // Let's use router.post instead for consistency with Inertia
        } catch (e) {
            console.error(e);
        }
        // Actually, let's use router for the call to utilize existing controller logic
        router.post(route('settings.shipping.check-rates'), {
            destination_postal_code: selectedCustomer.postal_code,
            weight: 1000, // Dummy weight for now
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.flash.rates) {
                    setShippingRates(page.props.flash.rates);
                    toast.success("Ongkir berhasil dicek");
                }
                setIsCheckingRates(false);
            },
            onError: () => {
                toast.error("Gagal cek ongkir");
                setIsCheckingRates(false);
            }
        });
    };

    // Calculations
    const manualDiscount = useMemo(
        () => Math.max(0, Number(discountInput) || 0),
        [discountInput]
    );

    const voucherSubtotalAmount = useMemo(() => voucherSubtotal?.amount || 0, [voucherSubtotal]);
    const voucherShippingAmount = useMemo(() => voucherShipping?.amount || 0, [voucherShipping]);
    const totalVoucherDiscount = voucherSubtotalAmount + voucherShippingAmount;

    const shipping = useMemo(
        () => Math.max(0, Number(shippingInput) || 0),
        [shippingInput]
    );

    const subtotal = useMemo(() => carts_total ?? 0, [carts_total]);
    
    // Stacking Discount Logic: (Subtotal - ManualDiscount - VoucherSubtotal) + (Shipping - VoucherShipping)
    // Note: ensure no negative components
    const payable = useMemo(
        () => {
            const netSubtotal = Math.max(0, subtotal - manualDiscount - voucherSubtotalAmount);
            const netShipping = Math.max(0, shipping - voucherShippingAmount);
            return netSubtotal + netShipping;
        },
        [subtotal, manualDiscount, voucherSubtotalAmount, shipping, voucherShippingAmount]
    );

    const isCashPayment = !payLater && paymentMethod === "cash";
    const cash = useMemo(
        () => (isCashPayment ? Math.max(0, Number(cashInput) || 0) : payable),
        [cashInput, isCashPayment, payable]
    );
    const cartCount = useMemo(
        () => carts.reduce((total, item) => total + Number(item.qty), 0),
        [carts]
    );

    // Re-check vouchers when dependencies change
    useEffect(() => {
        if (voucherSubtotal) handleCheckVoucher(voucherSubtotal.code, true);
        if (voucherShipping) handleCheckVoucher(voucherShipping.code, true);
    }, [subtotal, manualDiscount, shipping]);

    const handleCheckVoucher = async (code = voucherCode, isRecheck = false) => {
        if (!code) return;
        if (!isRecheck) setCheckingVoucher(true);

        try {
            const response = await axios.post(route('transactions.checkVoucher'), {
                voucher_code: code,
                subtotal: subtotal,
                manual_discount: manualDiscount,
                shipping_cost: shipping,
                customer_id: selectedCustomer?.id
            });

            const { data } = response.data;
            
            // Assign to correct slot
            if (data.target === 'subtotal') {
                setVoucherSubtotal(data);
                if (!isRecheck) toast.success("Voucher Potongan Harga dipasang!");
            } else {
                setVoucherShipping(data);
                if (!isRecheck) toast.success("Voucher Potongan Ongkir dipasang!");
            }

            if (!isRecheck) {
                setVoucherCode(""); // Clear input on success
                setShowVoucherList(false);
            }
        } catch (error) {
            // Only remove if it was active and failed re-check
            if (isRecheck) {
                 // Check which one failed
                 if (voucherSubtotal?.code === code) setVoucherSubtotal(null);
                 if (voucherShipping?.code === code) setVoucherShipping(null);
                 // Silent or warning?
            } else {
                const msg = error.response?.data?.message || "Voucher tidak valid";
                toast.error(msg);
            }
        } finally {
            if (!isRecheck) setCheckingVoucher(false);
        }
    };
    
    // Clear voucher
    const handleRemoveVoucher = (type) => { // 'subtotal' or 'shipping'
        if (type === 'subtotal') setVoucherSubtotal(null);
        if (type === 'shipping') setVoucherShipping(null);
    };

    // Payment options
    const paymentOptions = useMemo(() => {
        const options = Array.isArray(paymentGateways)
            ? paymentGateways.filter(
                  (gateway) =>
                      gateway?.value && gateway.value.toLowerCase() !== "cash"
              )
            : [];

        return [
            {
                value: "cash",
                label: "Tunai",
                description: "Pembayaran tunai langsung di kasir.",
            },
            {
                value: "cod",
                label: "COD",
                description: "Bayar di tempat (Cash On Delivery).",
            },
            ...options,
        ];
    }, [paymentGateways]);

    // Auto-set cash input for non-cash payment
    useEffect(() => {
        if (!isCashPayment && payable >= 0) {
            setCashInput(String(payable));
        }
    }, [isCashPayment, payable]);

    // Handle add product to cart
    // const handleAddToCart = async (product) => {
    //     if (!product?.id) return;

    //     setAddingProductId(product.id);

    //     router.post(
    //         route("transactions.addToCart"),
    //         {
    //             product_id: product.id,
    //             sell_price: product.sell_price,
    //             qty: 1,
    //         },
    //         {
    //             preserveScroll: true,
    //             onSuccess: () => {
    //                 toast.success(`${product.title} ditambahkan`);
    //                 setAddingProductId(null);
    //             },
    //             onError: () => {
    //                 toast.error("Gagal menambahkan produk");
    //                 setAddingProductId(null);
    //             },
    //         }
    //     );
    // };
    const handleAddToCart = async (product) => {
    if (!product?.id) return;

    setAddingProductId(product.id);

    router.post(
        route("transactions.addToCart"),
        {
            product_id: product.id,
            // sell_price dihapus karena backend harus ambil dari database
            qty: 1,
        },
        {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${product.title} ditambahkan ke keranjang`);
                setAddingProductId(null);
            },
            onError: (errors) => {
                // Mengambil pesan error pertama dari server jika ada
                const message = Object.values(errors)[0] || "Gagal menambahkan produk";
                toast.error(message);
                setAddingProductId(null);
            },
        }
    );
};

    // Handle update cart quantity
    const [updatingCartId, setUpdatingCartId] = useState(null);

    const handleUpdateQty = (cartId, newQty) => {
        if (newQty < 1) return;
        setUpdatingCartId(cartId);

        router.patch(
            route("transactions.updateCart", cartId),
            { qty: newQty },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setUpdatingCartId(null);
                },
                onError: (errors) => {
                    toast.error(errors?.message || "Gagal update quantity");
                    setUpdatingCartId(null);
                },
            }
        );
    };

    // Handle numpad confirm for cash input
    const handleNumpadConfirm = useCallback((value) => {
        setCashInput(String(value));
    }, []);

    // Handle hold transaction
    const [isHolding, setIsHolding] = useState(false);

    const handleHoldCart = async (label = null) => {
        if (carts.length === 0) {
            toast.error("Keranjang kosong");
            return;
        }

        setIsHolding(true);

        router.post(
            route("transactions.hold"),
            { label },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Transaksi ditahan");
                    setIsHolding(false);
                },
                onError: (errors) => {
                    toast.error(errors?.message || "Gagal menahan transaksi");
                    setIsHolding(false);
                },
            }
        );
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if user is typing in an input
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
                return;

            switch (e.key) {
                case "/":
                case "F5":
                    e.preventDefault();
                    // Focus search input
                    if (searchInputRef.current) {
                        searchInputRef.current.focus();
                    }
                    break;
                case "F1":
                    e.preventDefault();
                    setNumpadOpen(true);
                    break;
                case "F2":
                    e.preventDefault();
                    if (carts.length > 0 && selectedCustomer)
                        handleSubmitTransaction();
                    break;
                case "F3":
                    e.preventDefault();
                    setMobileView(
                        mobileView === "products" ? "cart" : "products"
                    );
                    break;
                case "F4":
                    e.preventDefault();
                    setShowShortcuts(!showShortcuts);
                    break;
                case "Escape":
                    setNumpadOpen(false);
                    setShowShortcuts(false);
                    setSearchQuery("");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [carts, selectedCustomer, mobileView, showShortcuts]);

    // Handle remove from cart
    const handleRemoveFromCart = (cartId) => {
        setRemovingItemId(cartId);

        router.delete(route("transactions.destroyCart", cartId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Item dihapus dari keranjang");
                setRemovingItemId(null);
            },
            onError: () => {
                toast.error("Gagal menghapus item");
                setRemovingItemId(null);
            },
        });
    };

    // Handle submit transaction
    const handleSubmitTransaction = () => {
        if (carts.length === 0) {
            toast.error("Keranjang masih kosong");
            return;
        }

        if (!selectedCustomer?.id) {
            toast.error("Pilih pelanggan terlebih dahulu");
            return;
        }

        if (payLater && !dueDate) {
            toast.error("Isi tanggal jatuh tempo untuk nota barang");
            return;
        }

        if (!payLater && isCashPayment && cash < payable) {
            toast.error("Jumlah pembayaran kurang dari total");
            return;
        }

        // Validate bank transfer requires bank selection
        const isBankTransfer = paymentMethod === "bank_transfer";
        if (isBankTransfer && !selectedBankAccount) {
            toast.error("Pilih rekening bank tujuan");
            return;
        }

        setIsSubmitting(true);

        router.post(
            route("transactions.store"),
            {
                customer_id: selectedCustomer.id,
                discount: manualDiscount, // Send Manual Discount separately if needed, but Controller expects 'discount' as total? 
                // Wait, implementation plan said: "I will make the voucher discount **replace** the manual discount field" -> OLD LOGIC
                // NEW LOGIC: Stacking.
                // Controller 'store' uses: 'discount' => $manualDiscount + $voucherDiscount
                // So I should send manualDiscount as 'discount' param, and voucher_code separately.
                // The Controller code I wrote calculates Total Discount = Manual (request->discount) + Voucher (calculated).
                // So here I send 'discount' as manualDiscount.
                
                // MULTI VOUCHER UPDATE
                voucher_codes: [
                    voucherSubtotal?.code,
                    voucherShipping?.code
                ].filter(Boolean), // Remove nulls
                
                shipping_cost: shipping,
                shipping_method: shippingMethod,
                shipping_courier_code: selectedCourier?.code,
                shipping_courier_service: selectedCourier?.service,
                
                grand_total: payable,
                cash: isCashPayment ? cash : payable,
                change: isCashPayment ? Math.max(cash - payable, 0) : 0,
                payment_gateway: payLater ? null : isCashPayment ? null : paymentMethod,
                bank_account_id: isBankTransfer
                    ? selectedBankAccount?.id
                    : null,
                pay_later: payLater,
                due_date: dueDate,
            },
            {
                onSuccess: () => {
                    setDiscountInput("");
                    setCashInput("");
                    setShippingInput("");
                    setVoucherCode("");
                    setVoucherSubtotal(null);
                    setVoucherShipping(null);
                    setSelectedCustomer(null);
                    setSelectedBankAccount(null);
                    setPaymentMethod(defaultPaymentGateway ?? "cash");
                    setPayLater(false);
                    setDueDate("");
                    setIsSubmitting(false);
                    toast.success("Transaksi berhasil!");
                },
                onError: () => {
                    setIsSubmitting(false);
                    toast.error("Gagal menyimpan transaksi");
                },
            }
        );
    };

    // Filter products including out of stock
    const allProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory =
                !selectedCategory || product.category_id === selectedCategory;
            const matchesSearch =
                !searchQuery ||
                product.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.barcode
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    return (
        <>
            <Head title="Transaksi" />

            <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
                {/* Mobile Tab Switcher */}
                <div className="lg:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <button
                        onClick={() => setMobileView("products")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                            mobileView === "products"
                                ? "text-primary-600 border-b-2 border-primary-500"
                                : "text-slate-500"
                        }`}
                    >
                        <IconShoppingCart size={18} />
                        <span>Produk</span>
                    </button>
                    <button
                        onClick={() => setMobileView("cart")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
                            mobileView === "cart"
                                ? "text-primary-600 border-b-2 border-primary-500"
                                : "text-slate-500"
                        }`}
                    >
                        <IconReceipt size={18} />
                        <span className="relative inline-flex items-center gap-1">
                            Keranjang
                            {cartCount > 0 && (
                                <span className="inline-flex items-center justify-center px-1.5 min-w-[20px] h-5 text-[11px] font-bold bg-primary-500 text-white rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </span>
                    </button>
                </div>

                {/* Left Panel - Products */}
                <div
                    className={`flex-1 bg-slate-100 dark:bg-slate-950 overflow-hidden ${
                        mobileView !== "products"
                            ? "hidden lg:flex lg:flex-col"
                            : "flex flex-col"
                    }`}
                >
                    <ProductGrid
                        products={allProducts}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        isSearching={isSearching}
                        onAddToCart={handleAddToCart}
                        addingProductId={addingProductId}
                        searchInputRef={searchInputRef}
                    />
                </div>

                {/* Right Panel - Cart & Payment */}
                <div
                    className={`w-full lg:w-[420px] xl:w-[480px] flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 min-h-0 overflow-hidden ${
                        mobileView !== "cart" ? "hidden lg:flex" : "flex"
                    }`}
                    style={{ height: "calc(100vh - 4rem)" }}
                >
                    {/* Customer Select - Fixed */}
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                        <CustomerSelect
                            customers={customers}
                            selected={selectedCustomer}
                            onSelect={setSelectedCustomer}
                            placeholder="Pilih pelanggan..."
                            error={errors?.customer_id}
                            label="Pelanggan"
                        />
                        {selectedCustomer && (
                            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                    <IconMapPin size={12} />
                                    Alamat Pengiriman
                                </p>
                                <p className="leading-relaxed">
                                    {selectedCustomer.address || '-'}
                                </p>
                                {(selectedCustomer.village_name || selectedCustomer.district_name || selectedCustomer.regency_name || selectedCustomer.province_name) && (
                                    <p className="mt-1 text-[10px] opacity-75">
                                        {[
                                            selectedCustomer.village_name,
                                            selectedCustomer.district_name,
                                            selectedCustomer.regency_name,
                                            selectedCustomer.province_name,
                                            selectedCustomer.postal_code
                                        ].filter(Boolean).join(', ')}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Held Transactions & Alerts */}
                    {heldCarts.length > 0 && (
                        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                            <HeldTransactions
                                heldCarts={heldCarts}
                                hasActiveCart={carts.length > 0}
                            />
                        </div>
                    )}

                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {/* Hold Button - at top of cart section */}
                        {carts.length > 0 && (
                            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                                <HoldButton
                                    hasItems={carts.length > 0}
                                    onHold={handleHoldCart}
                                    isHolding={isHolding}
                                />
                            </div>
                        )}

                        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <IconShoppingCart size={16} />
                                    Keranjang
                                </h3>
                                {carts.length > 0 && (
                                    <span className="px-2.5 py-0.5 text-xs font-bold bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 rounded-full whitespace-nowrap">
                                        {cartCount} item
                                    </span>
                                )}
                            </div>

                            {carts.length > 0 ? (
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                    {carts.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                                {item.product?.image ? (
                                                    <img
                                                        src={getProductImageUrl(
                                                            item.product.image
                                                        )}
                                                        alt={item.product.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <IconShoppingCart
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                                                    {item.product?.title ||
                                                        "Produk"}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {formatPrice(
                                                        item.product
                                                            ?.sell_price || 0
                                                    )}{" "}
                                                    × {item.qty}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQty(
                                                            item.id,
                                                            Math.max(
                                                                1,
                                                                item.qty - 1
                                                            )
                                                        )
                                                    }
                                                    disabled={item.qty <= 1}
                                                    className="w-6 h-6 rounded flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 disabled:opacity-50 text-xs"
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center text-xs font-medium">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQty(
                                                            item.id,
                                                            item.qty + 1
                                                        )
                                                    }
                                                    className="w-6 h-6 rounded flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 text-xs"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveFromCart(
                                                            item.id
                                                        )
                                                    }
                                                    className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/50 ml-1"
                                                >
                                                    <IconTrash size={12} />
                                                </button>
                                            </div>
                                            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 w-16 text-right">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-6 text-center">
                                    <IconShoppingCart
                                        size={32}
                                        className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
                                    />
                                    <p className="text-sm text-slate-400">
                                        Keranjang kosong
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Payment Details - Scrollable */}
                        <div className="p-3 space-y-4">
                            {/* Pay later toggle */}
                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                        Bayar Belakangan (Nota Barang)
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Tidak perlu bayar sekarang, catat sebagai piutang.
                                    </p>
                                </div>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={payLater}
                                        onChange={(e) => {
                                            setPayLater(e.target.checked);
                                            if (e.target.checked) {
                                                setSelectedBankAccount(null);
                                                setPaymentMethod("cash");
                                            }
                                        }}
                                    />
                                    <span
                                        className={`w-11 h-6 flex items-center bg-slate-300 rounded-full p-1 transition ${
                                            payLater ? "bg-primary-500" : ""
                                        }`}
                                    >
                                        <span
                                            className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                                                payLater ? "translate-x-5" : ""
                                            }`}
                                        />
                                    </span>
                                </label>
                            </div>

                            {/* Shipping Section */}
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <IconTruck size={16} />
                                        {paymentMethod === "cod" ? "Biaya COD / Ongkir" : "Pengiriman (Ongkir)"}
                                    </h3>
                                    <select
                                        value={shippingMethod}
                                        onChange={(e) => {
                                            setShippingMethod(e.target.value);
                                            setShippingInput("");
                                            setSelectedCourier(null);
                                            setShippingRates([]);
                                        }}
                                        className="h-8 pl-2 pr-8 text-xs rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="off">Off</option>
                                        <option value="manual">Manual</option>
                                        <option value="using_vendor">Cek Ongkir</option>
                                    </select>
                                </div>

                                {shippingMethod !== "using_vendor" && (
                                    <div className="relative">
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${shippingMethod === 'off' ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}`}>Rp</span>
                                        <input
                                            type="number"
                                            value={shippingMethod === 'off' ? '' : shippingInput}
                                            onChange={(e) => setShippingInput(e.target.value)}
                                            disabled={shippingMethod === 'off'}
                                            placeholder="0"
                                            className={`w-full h-9 pl-8 pr-3 text-xs rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed`}
                                        />
                                    </div>
                                )}

                                {shippingMethod === "using_vendor" && (
                                    <div className="space-y-3">
                                        {!selectedCourier ? (
                                            <>
                                                <button
                                                    onClick={handleCheckRates}
                                                    disabled={isCheckingRates}
                                                    className="w-full h-9 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                                >
                                                    {isCheckingRates ? "Memuat..." : (
                                                        <>
                                                            <IconTruck size={14} />
                                                            Cek Ongkir
                                                        </>
                                                    )}
                                                </button>

                                                {shippingRates.length > 0 && (
                                                    <div className="space-y-2 mt-2 max-h-[200px] overflow-y-auto">
                                                       {shippingRates.map((rate, idx) => (
                                                            <div 
                                                                key={idx}
                                                                onClick={() => {
                                                                    setShippingInput(String(rate.price));
                                                                    setSelectedCourier({
                                                                        code: rate.courier_code,
                                                                        service: rate.courier_service_code,
                                                                        name: rate.courier_name,
                                                                        service_name: rate.courier_service_name,
                                                                        price: rate.price,
                                                                        etd: rate.duration
                                                                    });
                                                                    setShippingRates([]); // Hide list after selection
                                                                }} 
                                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <p className="text-xs font-bold text-slate-800 dark:text-white uppercase">{rate.company} - {rate.courier_service_name}</p>
                                                                        <p className="text-[10px] text-slate-500">Est: {rate.duration}</p>
                                                                    </div>
                                                                    <p className="text-xs font-bold text-primary-600">Rp {rate.price.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                       ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="p-3 bg-white dark:bg-slate-800 border border-primary-200 dark:border-primary-800 rounded-lg relative">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedCourier(null);
                                                        setShippingInput("");
                                                    }}
                                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                                >
                                                    <IconX size={14} />
                                                </button>
                                                <div className="flex items-center gap-2 mb-1">
                                                     <IconTruck size={16} className="text-primary-500" />
                                                     <p className="text-xs font-bold text-slate-800 dark:text-white uppercase">
                                                        {selectedCourier.name} - {selectedCourier.service_name}
                                                     </p>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Est: {selectedCourier.etd}</span>
                                                    <span className="font-bold text-primary-600">Rp {selectedCourier.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {payLater && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                        Tanggal Jatuh Tempo
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    />
                                </div>
                            )}

                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    Metode Pembayaran
                                </label>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {paymentOptions.map((method) => (
                                        <button
                                            key={method.value}
                                            onClick={() =>
                                                !payLater &&
                                                setPaymentMethod(method.value)
                                            }
                                            disabled={payLater}
                                            className={`flex-1 min-w-fit p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                                paymentMethod === method.value && !payLater
                                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                                                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                            } ${payLater ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    paymentMethod ===
                                                        method.value &&
                                                    !payLater
                                                        ? "bg-primary-500 text-white"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                                }`}
                                            >
                                                {method.value === "cash" ? (
                                                    <IconCash size={16} />
                                                ) : method.value === "cod" ? (
                                                    <IconTruck size={16} />
                                                ) : method.value ===
                                                  "bank_transfer" ? (
                                                    <IconBuildingBank
                                                        size={16}
                                                    />
                                                ) : (
                                                    <IconCreditCard size={16} />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p
                                                    className={`text-sm font-semibold ${
                                                        paymentMethod ===
                                                        method.value
                                                            ? "text-primary-700 dark:text-primary-300"
                                                            : "text-slate-700 dark:text-slate-300"
                                                    }`}
                                                >
                                                    {method.label}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bank Selector - Only for bank_transfer */}
                            {paymentMethod === "bank_transfer" &&
                                bankAccounts.length > 0 &&
                                !payLater && (
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                            Rekening Tujuan
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {bankAccounts.map((bank) => {
                                                const isActive =
                                                    selectedBankAccount?.id ===
                                                    bank.id;
                                                return (
                                                    <button
                                                        key={bank.id}
                                                        onClick={() =>
                                                            setSelectedBankAccount(
                                                                bank
                                                            )
                                                        }
                                                        className={`p-3 rounded-xl border-2 transition-colors flex items-center gap-3 text-left ${
                                                            isActive
                                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                                                                : "border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800"
                                                        }`}
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                                            {bank.logo_url ? (
                                                                <img
                                                                    src={
                                                                        bank.logo_url
                                                                    }
                                                                    alt={
                                                                        bank.bank_name
                                                                    }
                                                                    className="max-w-full max-h-full object-contain"
                                                                />
                                                            ) : (
                                                                <IconBuildingBank
                                                                    size={18}
                                                                    className="text-slate-500"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                                {
                                                                    bank.bank_name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                                {
                                                                    bank.account_number
                                                                }
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-500">
                                                                a.n.{" "}
                                                                {
                                                                    bank.account_name
                                                                }
                                                            </p>
                                                        </div>
                                                        {isActive && (
                                                            <span className="text-[11px] font-semibold text-primary-600">
                                                                Dipilih
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                            {/* Quick Amounts - Only for cash */}
                            {paymentMethod === "cash" && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                        Nominal Cepat
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[10000, 20000, 50000, 100000].map(
                                            (amt) => (
                                                <button
                                                    key={amt}
                                                    onClick={() =>
                                                        setCashInput(
                                                            String(amt)
                                                        )
                                                    }
                                                    className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                                                        Number(cashInput) ===
                                                        amt
                                                            ? "bg-primary-500 text-white"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                                                    }`}
                                                >
                                                    {formatPrice(amt)}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Voucher Section */}
                            <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                                <div className="flex items-center justify-between mb-2">
                                     <div className="flex items-center gap-2">
                                        <IconTicket size={16} className="text-indigo-600 dark:text-indigo-400" />
                                        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Voucher</span>
                                    </div>
                                    <span className="text-[10px] text-indigo-500 font-medium bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                                        Max 2 (1 Harga + 1 Ongkir)
                                    </span>
                                </div>
                                
                                {/* Active Vouchers Display */}
                                <div className="space-y-2 mb-3">
                                    {/* Subtotal Voucher */}
                                    {voucherSubtotal && (
                                         <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200 px-3 py-2 rounded-lg flex items-center justify-between shadow-sm">
                                             <div className="flex-1 min-w-0">
                                                 <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm truncate">{voucherSubtotal.code}</span>
                                                    <span className="text-[10px] uppercase bg-green-100 text-green-700 px-1.5 rounded">Produk</span>
                                                 </div>
                                                 <span className="text-xs text-indigo-500 dark:text-indigo-400">
                                                     Hemat {formatPrice(voucherSubtotal.amount)}
                                                 </span>
                                             </div>
                                             <button
                                                onClick={() => handleRemoveVoucher('subtotal')}
                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-danger-500 transition-colors"
                                             >
                                                 <IconX size={16} />
                                             </button>
                                         </div>
                                    )}

                                    {/* Shipping Voucher */}
                                     {voucherShipping && (
                                         <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200 px-3 py-2 rounded-lg flex items-center justify-between shadow-sm">
                                             <div className="flex-1 min-w-0">
                                                 <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm truncate">{voucherShipping.code}</span>
                                                    <span className="text-[10px] uppercase bg-blue-100 text-blue-700 px-1.5 rounded">Ongkir</span>
                                                 </div>
                                                 <span className="text-xs text-indigo-500 dark:text-indigo-400">
                                                     Hemat {formatPrice(voucherShipping.amount)}
                                                 </span>
                                             </div>
                                             <button
                                                onClick={() => handleRemoveVoucher('shipping')}
                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-danger-500 transition-colors"
                                             >
                                                 <IconX size={16} />
                                             </button>
                                         </div>
                                    )}
                                </div>

                                {/* Voucher Input & List */}
                                <div className="relative">
                                    <div className="flex gap-2">
                                         <input
                                            type="text"
                                            value={voucherCode}
                                            onChange={(e) => {
                                                setVoucherCode(e.target.value.toUpperCase());
                                                setShowVoucherList(true);
                                            }}
                                            onFocus={() => setShowVoucherList(true)}
                                            onBlur={() => setTimeout(() => setShowVoucherList(false), 200)} // Delay to allow click on list
                                            placeholder="Kode Voucher / Pilih..."
                                            className="flex-1 h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 uppercase placeholder:normal-case"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleCheckVoucher(voucherCode);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleCheckVoucher(voucherCode)}
                                            disabled={!voucherCode || checkingVoucher}
                                            className="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center min-w-[60px]"
                                        >
                                            {checkingVoucher ? (
                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                "Pakai"
                                            )}
                                        </button>
                                    </div>

                                    {/* Dropdown List */}
                                    {showVoucherList && active_vouchers.length > 0 && (
                                        <div className="absolute top-10 left-0 right-0 z-20 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                                            {active_vouchers
                                                .filter(v => !voucherCode || v.code.includes(voucherCode))
                                                .map(v => (
                                                <button
                                                    key={v.id}
                                                    type="button" // Prevent form submit
                                                    onClick={() => {
                                                        setVoucherCode(v.code);
                                                        handleCheckVoucher(v.code);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center justify-between group"
                                                >
                                                    <div>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300 block">{v.code}</span>
                                                        <span className="text-slate-500">{v.name}</span>
                                                    </div>
                                                    <div className="text-right">
                                                         <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                                             v.discount_target === 'subtotal' 
                                                             ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                                                             : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                                         }`}>
                                                             {v.discount_target === 'subtotal' ? 'Produk' : 'Ongkir'}
                                                         </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Discount Input */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    Diskon (Rp)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={discountInput}
                                        onChange={(e) =>
                                            setDiscountInput(
                                                e.target.value.replace(
                                                    /[^\d]/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="0"
                                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    />
                                </div>
                            </div>



                            {/* Cash Input - Only for cash */}
                            {paymentMethod === "cash" && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                        Jumlah Bayar (Rp)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                            Rp
                                        </span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={cashInput}
                                            onChange={(e) =>
                                                setCashInput(
                                                    e.target.value.replace(
                                                        /[^\d]/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="0"
                                            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base font-semibold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary & Submit - Fixed at bottom */}
                    <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-3">
                        {/* Summary Row */}
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-medium">
                                {formatPrice(subtotal)}
                            </span>
                        </div>
                        {manualDiscount > 0 && (
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-slate-500">Diskon</span>
                                <span className="text-danger-500">
                                    -{formatPrice(manualDiscount)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-slate-800 dark:text-white">
                                Total
                            </span>
                            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                {formatPrice(payable)}
                            </span>
                        </div>

                        {paymentMethod === "cash" &&
                            !payLater &&
                            cash >= payable &&
                            payable > 0 && (
                                <div className="flex justify-between items-center mb-3 p-2 rounded-lg bg-success-50 dark:bg-success-950/30">
                                    <span className="text-sm text-success-700 dark:text-success-400">
                                        Kembalian
                                    </span>
                                    <span className="font-bold text-success-600">
                                        {formatPrice(cash - payable)}
                                    </span>
                                </div>
                            )}

                        {/* Submit Button - Always visible */}
                        <button
                            onClick={handleSubmitTransaction}
                            disabled={
                                !carts.length ||
                                !selectedCustomer ||
                                (!payLater &&
                                    paymentMethod === "cash" &&
                                    cash < payable) ||
                                isSubmitting
                            }
                            className={`w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                                carts.length &&
                                selectedCustomer &&
                                (paymentMethod !== "cash" || cash >= payable)
                                    ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <IconReceipt size={18} />
                                    <span>
                                        {!carts.length
                                            ? "Keranjang Kosong"
                                            : !selectedCustomer
                                            ? "Pilih Pelanggan"
                                            : paymentMethod === "cash" &&
                                              cash < payable
                                            ? `Kurang ${formatPrice(
                                                  payable - cash
                                              )}`
                                            : "Selesaikan Transaksi"}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Numpad Modal */}
            <NumpadModal
                isOpen={numpadOpen}
                onClose={() => setNumpadOpen(false)}
                onConfirm={handleNumpadConfirm}
                title="Jumlah Bayar"
                initialValue={Number(cashInput) || 0}
                isCurrency={true}
            />

            {/* Keyboard Shortcuts Help */}
            {showShortcuts && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60"
                        onClick={() => setShowShortcuts(false)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <IconKeyboard size={24} />
                            Keyboard Shortcuts
                        </h3>
                        <div className="space-y-3">
                            {[
                                ["F1", "Buka Numpad"],
                                ["F2", "Selesaikan Transaksi"],
                                ["F3", "Toggle Produk/Keranjang"],
                                ["F4", "Tampilkan Bantuan"],
                                ["Esc", "Tutup Modal"],
                            ].map(([key, desc]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-slate-600 dark:text-slate-400">
                                        {desc}
                                    </span>
                                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                                        {key}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowShortcuts(false)}
                            className="mt-6 w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page) => <POSLayout children={page} />;
