import React, { useEffect } from 'react';
import Modal from '@/Components/Modal';
import Input from '@/Components/Dashboard/Input';
import Button from '@/Components/Dashboard/Button';
import { useForm } from '@inertiajs/react';
import { IconDeviceFloppy } from '@tabler/icons-react';
import toast from 'react-hot-toast';

export default function CategoryCreateModal({ show, onClose, onSuccess }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (show) {
            reset();
            clearErrors();
        }
    }, [show]);

    const submit = (e) => {
        e.preventDefault();
        post(route('apps.blog-categories.store'), {
            onSuccess: (page) => {
                // The page props will contain the latest data, but for inline creation
                // we might need to fetch the new list or get the created item.
                // Since this is Inertia, the page props 'categories' should update if we reload,
                // but we are inside a modal on the create page. 
                // A better approach for inline is to return the new item from the backend,
                // but standard Inertia store returns a redirect.
                // However, we can use the 'onSuccess' callback to trigger a reload of categories in the parent
                // or just optimistically add it if we know the ID (which we don't without a JSON response).
                
                // For now, let's assume the parent will refresh the props or we trigger a reload.
                // Actually, for inline usage, an axios call (API) might be better than Inertia useForm
                // to get the JSON response of the created item directly.
                // But let's stick to Inertia for consistency if possible, or use axios if we need the ID.
                
                toast.success('Kategori berhasil dibuat');
                onSuccess(); // Parent should handle data refresh
                onClose();
            },
            onError: (errors) => {
                toast.error('Gagal membuat kategori');
            }
        });
    };

    // To properly handle inline creation and selecting the new item, 
    // we really should use Axios here instead of Inertia.post if we want to avoid a full page reload/redirect loop
    // or if we want to immediately select the new item without complications.
    // Let's refactor to use axios for this specific inline modal.
    
    const submitWithAxios = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('apps.blog-categories.store'), data, {
                headers: {
                    'X-Inertia': 'true', // Trick backend to treat as Inertia or just ensure we handle JSON
                    'Accept': 'application/json',
                }
            });
            
            // If backend returns JSON with the created item
            if (response.data) {
                toast.success('Kategori berhasil dibuat');
                onSuccess(response.data); // Pass the new item back
                onClose();
                reset();
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data.errors) {
                 // Set errors manually if needed, or just toast
                 toast.error('Gagal membuat kategori. Periksa inputan.');
            } else {
                toast.error('Terjadi kesalahan.');
            }
        }
    }

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Buat Kategori Baru
                </h2>
                <form onSubmit={submitWithAxios} className="space-y-4">
                    <Input
                        label="Nama Kategori"
                        placeholder="Contoh: Tips & Trik"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        // errors={errors.name} // Axios handling might need different error display
                    />
                    <Input
                        label="Deskripsi"
                        placeholder="Deskripsi singkat..."
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            label="Batal"
                            className="bg-slate-100 text-slate-600 hover:bg-slate-200"
                            onClick={onClose}
                        />
                         <Button
                            type="submit"
                            label={processing ? "Menyimpan..." : "Simpan"}
                            icon={<IconDeviceFloppy size={18} />}
                            className="bg-primary-500 text-white hover:bg-primary-600"
                            disabled={processing}
                        />
                    </div>
                </form>
            </div>
        </Modal>
    );
}
