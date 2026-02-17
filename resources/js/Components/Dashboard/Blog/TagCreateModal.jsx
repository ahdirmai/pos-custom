import React, { useEffect } from 'react';
import Modal from '@/Components/Modal';
import Input from '@/Components/Dashboard/Input';
import Button from '@/Components/Dashboard/Button';
import { useForm } from '@inertiajs/react';
import { IconDeviceFloppy } from '@tabler/icons-react';
import toast from 'react-hot-toast';

export default function TagCreateModal({ show, onClose, onSuccess }) {
    const { data, setData, reset } = useForm({
        name: '',
    });

    useEffect(() => {
        if (show) {
            reset();
        }
    }, [show]);

    const submitWithAxios = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('apps.blog-tags.store'), data, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (response.data) {
                toast.success('Tag berhasil dibuat');
                onSuccess(response.data);
                onClose();
                reset();
            }
        } catch (error) {
            console.error(error);
             toast.error('Gagal membuat tag.');
        }
    }

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Buat Tag Baru
                </h2>
                <form onSubmit={submitWithAxios} className="space-y-4">
                    <Input
                        label="Nama Tag"
                        placeholder="Contoh: Fashion"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
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
                            label="Simpan"
                            icon={<IconDeviceFloppy size={18} />}
                            className="bg-primary-500 text-white hover:bg-primary-600"
                        />
                    </div>
                </form>
            </div>
        </Modal>
    );
}
