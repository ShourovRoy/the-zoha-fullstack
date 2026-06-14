'use client'

import { useState } from "react";
import { ProductImageGallaryType } from "@/database/schemas/product";

const getAssetUrl = (key: string) => {
    if (!key) return "";
    if (key.startsWith('http')) return key;
    return `${process.env.NEXT_PUBLIC_S3_MEDIA_DOMAIN}/${key}`;
}

interface GalleryProps {
    featuredImageKey: string;
    images: ProductImageGallaryType[] | undefined;
}

const ProductImageGallary = ({ featuredImageKey, images }: GalleryProps) => {
    // Default to the featured cover image on load
    const [activeImage, setActiveImage] = useState<string>(featuredImageKey);
    const hasGallery = images && images.length > 0;

    return (
        <div className="space-y-4 w-full">
            {/* Primary Main Display (Defaults to Featured Image) */}
            <div className="w-full aspect-square bg-white rounded-2xl border border-stone-200/60 overflow-hidden flex items-center justify-center relative group">
                <img
                    src={getAssetUrl(activeImage)}
                    alt="Product view"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
            </div>

            {/* Thumbnail Strip (Includes Featured Image first, then Gallery Images) */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {/* Featured Image Thumbnail */}
                <button
                    onClick={() => setActiveImage(featuredImageKey)}
                    className={`relative h-16 w-16 aspect-square rounded-xl bg-white overflow-hidden border shrink-0 transition-all ${activeImage === featuredImageKey
                            ? "border-stone-900 ring-2 ring-stone-900/5 scale-95"
                            : "border-stone-200/80 hover:border-stone-400"
                        }`}
                >
                    <img src={getAssetUrl(featuredImageKey)} alt="Main cover thumbnail" className="w-full h-full object-cover" />
                </button>

                {/* Additional Gallery Thumbnails */}
                {hasGallery && images.map((image, index) => {
                    const isSelected = activeImage === image.imageKey;
                    return (
                        <button
                            key={image.id || index}
                            onClick={() => setActiveImage(image.imageKey)}
                            className={`relative h-16 w-16 aspect-square rounded-xl bg-white overflow-hidden border shrink-0 transition-all ${isSelected
                                    ? "border-stone-900 ring-2 ring-stone-900/5 scale-95"
                                    : "border-stone-200/80 hover:border-stone-400"
                                }`}
                        >
                            <img
                                src={getAssetUrl(image.imageKey)}
                                alt={`Gallery thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

export default ProductImageGallary;