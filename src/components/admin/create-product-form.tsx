'use client'

import { ReactNode, useState, ChangeEvent } from "react"
import Image from "next/image"
import { PackagePlus, Type, FileText, FolderOpen, ImageIcon, X, RefreshCw, Images } from "lucide-react"

interface GalleryImage {
  id: string;
  url: string;
}

export default function CreateProductForm({ children }: { children: ReactNode }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  // State tracking additional grid layout product imagery assets
  const [galleryPreviews, setGalleryPreviews] = useState<GalleryImage[]>([])

  // Primary Featured Image Handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  // Multi-Image Gallery Handler
  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: GalleryImage[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(), // Unique id to track array positions and keys cleanly
        url: URL.createObjectURL(file) // Ultra-fast object streaming strings for inline UI rendering
      }))
      
      setGalleryPreviews((prev) => [...prev, ...newImages])
    }
  }

  const clearImagePreview = () => {
    setImagePreview(null)
    const fileInput = document.getElementById('productImage') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const removeGalleryImage = (id: string) => {
    setGalleryPreviews((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-xl shadow-xs p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-5 mb-6">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
          <PackagePlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-neutral-900">New Product Asset</h2>
          <p className="text-xs text-neutral-500">Specify details to attach inventory directly to a storefront shelf.</p>
        </div>
      </div>

      <form className="space-y-5">
        {/* Title Input */}
        <div>
          <label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <Type className="h-3.5 w-3.5 text-neutral-400" />
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="e.g., Wireless Mechanical Keyboard"
            className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all"
          />
        </div>

        {/* Short Description Input */}
        <div>
          <label htmlFor="shortDesc" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <FileText className="h-3.5 w-3.5 text-neutral-400" />
            Short Summary
          </label>
          <input
            type="text"
            name="shortDesc"
            id="shortDesc"
            placeholder="Brief snippet for product catalog grid item views"
            className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all"
          />
        </div>

        {/* Detailed Description Textarea */}
        <div>
          <label htmlFor="desc" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <FileText className="h-3.5 w-3.5 text-neutral-400" />
            Full Description
          </label>
          <textarea
            name="desc"
            id="desc"
            rows={4}
            placeholder="Write a comprehensive overview about features, build material, or guidelines..."
            className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Dynamic Category Selector */}
        <div>
          <label htmlFor="category" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <FolderOpen className="h-3.5 w-3.5 text-neutral-400" />
            Storefront Department
          </label>
          <div className="relative">
            <select
              name="category"
              id="category"
              className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-neutral-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* PRIMARY FEATURED IMAGE */}
        <div>
          <label htmlFor="productImage" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <ImageIcon className="h-3.5 w-3.5 text-neutral-400" />
            Primary Featured Image
          </label>
          
          {imagePreview ? (
            <div className="relative w-full h-64 border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 shadow-inner group">
              <Image 
                src={imagePreview} 
                alt="Product image preview" 
                fill 
                className="object-cover transition-transform duration-300 group-hover:scale-101" 
                unoptimized={imagePreview.startsWith('data:image/svg+xml')}
              />
              
              <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-transparent to-transparent flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-xs text-white font-medium truncate max-w-[70%]">Main Catalog Shot</p>
                <div className="flex gap-2">
                  <label 
                    htmlFor="productImage" 
                    className="p-2 bg-white/95 hover:bg-white text-neutral-700 rounded-md shadow-xs backdrop-blur-xs transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </label>
                  <button 
                    type="button" 
                    onClick={clearImagePreview} 
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-xs transition-colors flex items-center justify-center"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label htmlFor="productImage" className="flex flex-col items-center justify-center w-full h-36 border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-stone-50/50 hover:bg-stone-50 hover:border-amber-400 transition-colors p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <ImageIcon className="h-6 w-6 mb-2 text-neutral-400" />
                  <p className="text-xs font-semibold text-neutral-700">Upload primary display photo</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Universal image support (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  name="productImage" 
                  id="productImage" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*" 
                />
              </label>
            </div>
          )}
        </div>

        {/* ADDITIONAL GALLERY SUB-IMAGES GRID BLOCK */}
        <div>
          <label htmlFor="galleryImages" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <Images className="h-3.5 w-3.5 text-neutral-400" />
            Additional Gallery Views
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {/* Displaying uploaded extra image frames */}
            {galleryPreviews.map((image) => (
              <div key={image.id} className="relative aspect-square border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 shadow-2xs group">
                <Image 
                  src={image.url} 
                  alt="Gallery sub preview" 
                  fill 
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(image.id)}
                  className="absolute top-1 right-1 p-1 bg-neutral-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* The persistent incremental drop box square */}
            <label 
              htmlFor="galleryImages" 
              className="flex flex-col items-center justify-center aspect-square border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-stone-50/50 hover:bg-stone-50 hover:border-amber-400 transition-colors p-2 text-center"
            >
              <Images className="h-5 w-5 text-neutral-400 mb-1" />
              <span className="text-[10px] font-medium text-neutral-600">Add View</span>
              <input 
                type="file" 
                name="galleryImages" 
                id="galleryImages" 
                className="hidden" 
                multiple // Enables multi-file batch selections from folders natively
                onChange={handleGalleryChange}
                accept="image/*" 
              />
            </label>
          </div>
        </div>

        {/* Submit Action Block */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-lg shadow-2xs hover:shadow-xs active:transform active:scale-[0.99] transition-all cursor-pointer text-center"
          >
            Upload Product To Storefront
          </button>
        </div>
      </form>
    </div>
  )
}