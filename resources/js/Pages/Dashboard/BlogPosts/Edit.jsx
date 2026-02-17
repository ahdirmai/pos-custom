import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconArrowLeft,
    IconDeviceFloppy,
    IconPhoto,
    IconPlus,
} from "@tabler/icons-react";
import Input from "@/Components/Dashboard/Input";
import QuillEditor from "@/Components/Dashboard/QuillEditor";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone";
import InputSelect from "@/Components/Dashboard/InputSelect";
import CategoryCreateModal from "@/Components/Dashboard/Blog/CategoryCreateModal";
import TagCreateModal from "@/Components/Dashboard/Blog/TagCreateModal";

export default function Edit({ post: blogPost, categories: initialCategories, tags: initialTags }) {
    const { data, setData, post, processing, errors } = useForm({
        title: blogPost.title,
        blog_category_id: blogPost.blog_category_id,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        image: null,
        tags: blogPost.tags.map(tag => tag.id),
        is_active: Boolean(blogPost.is_active),
        _method: "PUT",
    });
    
    // Local state for categories and tags
    const [categories, setCategories] = useState(initialCategories);
    const [tags, setTags] = useState(initialTags);
    
    // Modals state
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showTagModal, setShowTagModal] = useState(false);
    
    const [imagePreview, setImagePreview] = useState(blogPost.image);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleTagChange = (tagId) => {
        const newTags = data.tags.includes(tagId)
            ? data.tags.filter(id => id !== tagId)
            : [...data.tags, tagId];
        setData("tags", newTags);
    };

    const handleCategoryCreated = (newCategory) => {
        setCategories([...categories, newCategory]);
        setData("blog_category_id", newCategory.id); // Auto-select the new category
    };

    const handleTagCreated = (newTag) => {
        setTags([...tags, newTag]);
        setData("tags", [...data.tags, newTag.id]); // Auto-select the new tag
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("apps.blog-posts.update", blogPost.id));
    };

    return (
        <>
            <Head title="Edit Artikel" />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Edit Artikel
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <Link href={route('apps.blog-posts.index')} className="hover:text-primary-500 transition-colors">
                            Artikel
                        </Link>
                        <span>/</span>
                        <span>Edit</span>
                        <span>/</span>
                        <span className="line-clamp-1 max-w-[200px]">{blogPost.title}</span>
                    </div>
                </div>
                <Link href={route('apps.blog-posts.index')}>
                    <Button
                        type="button"
                        icon={<IconArrowLeft size={18} />}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        label="Kembali"
                    />
                </Link>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Konten Artikel
                        </h2>
                        
                        <div className="space-y-4">
                            <Input
                                type="text"
                                label="Judul Artikel"
                                placeholder="Masukkan judul yang menarik..."
                                errors={errors.title}
                                onChange={(e) => setData("title", e.target.value)}
                                value={data.title}
                            />

                            {/* Rich Text Editor */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Isi Artikel
                                </label>
                                <QuillEditor
                                    value={data.content}
                                    onChange={(content) => setData("content", content)}
                                    placeholder="Tulis konten artikel di sini..."
                                    error={errors.content}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar Settings */}
                <div className="space-y-6">
                    {/* Publish Action */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Publikasi
                        </h2>
                        <div className="flex items-center gap-3 mb-6">
                             <div className="flex items-center h-5">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                            </div>
                            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Terbitkan Langsung?
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <IconDeviceFloppy size={20} />
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>

                    {/* Category & Tags */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Pengaturan
                        </h2>
                        <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Kategori
                                        </label>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowCategoryModal(true)}
                                            className="text-primary-500 hover:text-primary-600 text-xs font-semibold flex items-center gap-1"
                                        >
                                            <IconPlus size={14} /> Buat Baru
                                        </button>
                                    </div>
                                    <InputSelect
                                        placeholder="Pilih Kategori"
                                        data={categories}
                                        selected={categories.find(c => c.id == data.blog_category_id) || null}
                                        setSelected={(selected) => setData("blog_category_id", selected.id)}
                                        errors={errors.blog_category_id}
                                        searchable={true}
                                    />
                                </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tags
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowTagModal(true)}
                                        className="text-primary-500 hover:text-primary-600 text-xs font-semibold flex items-center gap-1"
                                    >
                                        <IconPlus size={14} /> Buat Baru
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    {tags.map((tag) => (
                                        <label
                                            key={tag.id}
                                            className={`cursor-pointer inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                                                data.tags.includes(tag.id)
                                                    ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={data.tags.includes(tag.id)}
                                                onChange={() => handleTagChange(tag.id)}
                                            />
                                            {tag.name}
                                        </label>
                                    ))}
                                    {tags.length === 0 && (
                                        <p className="text-xs text-slate-400 italic p-2">Belum ada tags tersedia.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Gambar Utama
                        </h2>
                        <ImageUploadZone 
                            title="Upload Gambar"
                            icon={IconPhoto}
                            imagePreview={imagePreview}
                            onImageChange={handleImageChange}
                            onImageRemove={() => {
                                setImagePreview(null);
                                setData('image', null);
                            }}
                            error={errors.image}
                            className="h-48"
                        />
                         <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                            Format: JPG, PNG, JPEG. Max: 2MB.
                        </p>
                    </div>
                </div>

            </form>

            {/* Modals */}
            <CategoryCreateModal 
                show={showCategoryModal} 
                onClose={() => setShowCategoryModal(false)}
                onSuccess={handleCategoryCreated}
            />
            <TagCreateModal 
                show={showTagModal} 
                onClose={() => setShowTagModal(false)}
                onSuccess={handleTagCreated}
            />
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
