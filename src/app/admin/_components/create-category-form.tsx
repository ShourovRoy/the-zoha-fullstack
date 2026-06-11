'use client'

import { uploadImageToPresignedUrl } from "@/actions/admin/media-uploader"
import { FolderPlus, Image as ImageIcon, UploadCloud, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { useActionState, useState, useEffect } from "react"

const CreateCategoryForm = () => {
    const [categoryState, categoryAction, categoryPending] = useActionState(uploadImageToPresignedUrl, undefined)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImagePreview(URL.createObjectURL(file))
        }
    }

    // Automatically clean up object URL previews on success to prevent memory leaks
    useEffect(() => {
        if (categoryState?.success) {
            setImagePreview(null)
        }
    }, [categoryState])

    return (
        <div className="max-w-2xl mx-auto w-full bg-white border border-neutral-200 rounded-md shadow-xs p-5 sm:p-6">

            {/* Header Section */}
            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-neutral-100">
                <div className="p-2 bg-amber-50 rounded-md">
                    <FolderPlus className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Create New Category</h1>
                    <p className="text-sm text-neutral-500">Add a new multi-category anchor for grouping user products.</p>
                </div>
            </div>

            {/* Global Banner Messages */}
            <div className="space-y-4 mb-5">
                {/* 1. Success Message Case */}
                {categoryState?.message && (
                    <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 p-3.5 rounded-md flex items-start gap-2.5 font-medium animate-in fade-in duration-200">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>{categoryState.message}</div>
                    </div>
                )}

                {/* 2. Error Message Case */}
                {categoryState?.errorMessage && (
                    <div className="text-sm text-rose-800 bg-rose-50 border border-rose-200 p-3.5 rounded-md flex items-start gap-2.5 font-medium animate-in fade-in duration-200">
                        <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                        <div>{categoryState.errorMessage}</div>
                    </div>
                )}
            </div>

            {/* Form Fields */}
            <form action={categoryAction} className="space-y-5">

                {/* Category Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                        Category Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="e.g., Electronics, Home & Kitchen"
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors disabled:opacity-60 disabled:bg-stone-50"
                        required
                        disabled={categoryPending}
                    />
                    {/* Inline Zod Field-Specific Error Mapping */}
                    {categoryState?.errors?.name && (
                        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                            <AlertTriangle className="h-3 w-3" /> {categoryState.errors.name[0]}
                        </p>
                    )}
                </div>

                {/* Category Description */}
                <div>
                    <label htmlFor="desc" className="block text-sm font-medium text-neutral-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="desc"
                        id="desc"
                        rows={4}
                        placeholder="Provide a brief summary of what type of products belong in this category..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none disabled:opacity-60 disabled:bg-stone-50"
                        disabled={categoryPending}
                    />
                    {categoryState?.errors?.desc && (
                        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                            <AlertTriangle className="h-3 w-3" /> {categoryState.errors.desc[0]}
                        </p>
                    )}
                </div>

                {/* Category Thumbnail Image Upload Dropzone */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Category Thumbnail Image
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        {/* Interactive Drag/Drop Label Dropzone */}
                        <label
                            htmlFor="image"
                            className={`sm:col-span-2 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-md p-6 text-center bg-stone-50/50 transition-colors group ${categoryPending
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:border-amber-500 hover:bg-amber-50/10"
                                }`}
                        >
                            <UploadCloud className="h-8 w-8 text-neutral-400 group-hover:text-amber-500 mb-2 transition-colors" />
                            <span className="text-sm font-medium text-neutral-700 group-hover:text-amber-700 transition-colors">
                                Click to upload thumbnail
                            </span>
                            <span className="text-xs text-neutral-400 mt-1">
                                PNG, JPG, or WEBP up to 4MB
                            </span>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={categoryPending}
                            />
                        </label>

                        {/* Image Preview Box Window */}
                        <div className="h-32 border border-neutral-200 rounded-md bg-stone-50 flex items-center justify-center overflow-hidden relative">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Category preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-3 text-neutral-400">
                                    <ImageIcon className="h-6 w-6 mx-auto mb-1 opacity-60" />
                                    <span className="text-xs block">Preview window</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {categoryState?.errors?.image && (
                        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                            <AlertTriangle className="h-3 w-3" /> {categoryState.errors.image[0]}
                        </p>
                    )}
                </div>

                {/* Form CTA Submission Section */}
                <div className="pt-3 border-t border-neutral-100 flex justify-end gap-3">

                    <button
                        type="submit"
                        disabled={categoryPending}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-neutral-950 font-medium text-sm rounded shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {categoryPending && <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />}
                        {categoryPending ? 'Creating...' : 'Create Category'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateCategoryForm