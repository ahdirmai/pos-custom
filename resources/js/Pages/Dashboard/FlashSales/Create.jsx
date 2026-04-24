import React from "react";
import { Head, useForm } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import FlashSaleForm from "./Form";

export default function Create({ products }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        start_at: "",
        end_at: "",
        is_active: false,
        products: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("flash-sales.store"));
    };

    return (
        <>
            <Head title="Buat Flash Sale" />
            <FlashSaleForm
                title="Buat Flash Sale"
                subtitle="Susun satu sesi promo cepat dengan produk dan harga khusus."
                submitLabel="Simpan Flash Sale"
                products={products}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                backHref={route("flash-sales.index")}
            />
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
