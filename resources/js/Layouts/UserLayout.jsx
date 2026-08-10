import React from "react";
import { Toaster } from "react-hot-toast";
import Header from "@/Components/EndUser/Header";
import Footer from "@/Components/EndUser/Footer";
import CarFooter from "@/Components/CarLanding/CarFooter";
import MobileNavbar from "@/Components/EndUser/MobileNavbar";
import CartDrawer from "@/Components/EndUser/CartDrawer";
import { CartProvider } from "@/Context/CartContext";
import { WishlistProvider } from "@/Context/WishlistContext";

export default function UserLayout({
    children,
    hideMobileNav = false,
    headerVariant = "default",
    footerProps = {},
}) {
    return (
        <CartProvider>
            <WishlistProvider>
                <div
                    className="min-h-screen flex flex-col font-sans antialiased"
                    style={{
                        background: headerVariant === "showroom" ? "#07090a" : "#ffffff",
                        color: headerVariant === "showroom" ? "#fff" : "#212121",
                    }}
                >
                    <Header variant={headerVariant} />
                    <CartDrawer />
                    <main className="flex-grow">{children}</main>
                    {headerVariant === "showroom" || headerVariant === "light" ? (
                        <CarFooter {...footerProps} />
                    ) : (
                        <Footer />
                    )}
                    {!hideMobileNav && <MobileNavbar />}
                    <Toaster
                        position="bottom-center"
                        toastOptions={{
                            duration: 2000,
                            style: {
                                background: "#fff",
                                color: "#333",
                                borderRadius: "12px",
                                padding: "12px 16px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                            },
                        }}
                    />
                </div>
            </WishlistProvider>
        </CartProvider>
    );
}
