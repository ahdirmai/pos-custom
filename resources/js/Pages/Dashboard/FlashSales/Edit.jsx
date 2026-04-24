import React from "react";
import { Head, useForm } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import FlashSaleForm from "./Form";

export default function Edit({ flashSale, products }) {
    const { data, setData, post, processing, errors } = useForm({
        name: flashSale.name || "",
        description: flashSale.description || "",
        start_at: flashSale.start_at || "",
        end_at: flashSale.end_at || "",
        is_active: !!flashSale.is_active,
        products: flashSale.products || [],
        _method: "PUT",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("flash-sales.update", flashSale.id));
    };

    return (
        <>
            <Head title={`Edit ${flashSale.name}`} />
            <FlashSaleForm
                title="Edit Flash Sale"
                subtitle="Perbarui sesi promo tanpa mengubah gaya dashboard yang sudah ada."
                submitLabel="Update Flash Sale"
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

Edit.layout = (page) => <DashboardLayout children={page} />;
