
'use client'

import { createProduct } from "@/actions/admin/create-product-action";
import Image from "next/image"
import { ReactNode, useActionState, useEffect, useState } from "react"
import { PackagePlus, Type, FileText, FolderOpen, ImageIcon, X, Images, DollarSign, Box } from "lucide-react"

export interface GallaryImageInterface {
  id: string;
  name: string;
  imageUrl: string;
  file: File;
}

const CreateProductForm = ({ children }: { children: ReactNode }) => {
  const [createProductState, createProductAction, createProductPending] = useActionState(createProduct, undefined)

  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  const [featuredImageKeyPreview, setFeaturedImageKeyPreview] = useState<string | null>(null)
  const [gallaryImagesPreview, setGallaryImagePreview] = useState<GallaryImageInterface[]>([])

  const handleFeaturedImageKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFeaturedImageFile(file)
      setFeaturedImageKeyPreview(URL.createObjectURL(file))
    }
  }

  const handleImageGallaryKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const galleryImageFile: GallaryImageInterface = {
          id: crypto.randomUUID(),
          imageUrl: URL.createObjectURL(files[i]),
          name: files[i].name,
          file: files[i]
        }
        setGallaryImagePreview((prev) => [...prev, galleryImageFile])
      }
    }
    e.target.value = ""
  }

  const clearFeaturedImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFeaturedImageFile(null)
    setFeaturedImageKeyPreview(null)
  }

  const removeGallaryImageById = (e: React.MouseEvent<HTMLButtonElement>, gallaryImageKeyId: string) => {
    e.preventDefault()
    setGallaryImagePreview((prev) => {
      const target = prev.find((img) => img.id === gallaryImageKeyId)
      if (target) URL.revokeObjectURL(target.imageUrl)
      return prev.filter((gallaryImgElement) => gallaryImgElement.id !== gallaryImageKeyId)
    })
  }

  useEffect(() => {
    if (createProductState?.message) {
      setGallaryImagePreview([])
      setFeaturedImageFile(null)
      setFeaturedImageKeyPreview(null)

      // Added the two new fields to the clean resetting workflow loop
      const textInputs = ['name', 'shortDesc', 'desc', 'price', 'quantity', 'thresholdQuantity']
      textInputs.forEach(id => {
        const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement
        if (input) input.value = ""
      })
    }
  }, [createProductState?.message])

  return (
    <div className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-xl shadow-sm p-6 sm:p-8 mt-6">

      <div className="flex items-center gap-3 border-b border-neutral-100 pb-5 mb-6">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
          <PackagePlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-neutral-900">New Storefront Asset</h2>
          <p className="text-xs text-neutral-500">Specify parameters to inject a new inventory listing item securely.</p>
        </div>
      </div>

      {createProductState?.errorMessage && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium">
          {createProductState.errorMessage}
        </div>
      )}
      {createProductState?.message && (
        <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-lg font-medium">
          {createProductState.message}
        </div>
      )}

      <form action={createProductAction} className="space-y-5">

        {/* Product Title */}
        <div>
          <label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <Type className="h-3.5 w-3.5 text-neutral-400" />
            Product Title
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="e.g., Premium Wireless Soundbar"
            className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all"
          />
          {createProductState?.errors?.name && (
            <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.name[0]}</p>
          )}
        </div>

        {/* Short Summary */}
        <div>
          <label htmlFor="shortDesc" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <FileText className="h-3.5 w-3.5 text-neutral-400" />
            Short Summary
          </label>
          <input
            type="text"
            name="shortDesc"
            id="shortDesc"
            placeholder="Brief item features summary for showcase cards"
            className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all"
          />
          {createProductState?.errors?.shortDesc && (
            <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.shortDesc[0]}</p>
          )}
        </div>

        {/* Dual-Column Pricing and Base Stock Allocation Grid Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Retail Price */}
          <div>
            <label htmlFor="price" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
              Retail Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all"
            />
            {createProductState?.errors?.price && (
              <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.price[0]}</p>
            )}
          </div>

          {/* Stock Quantity */}
          <div>
            <label htmlFor="quantity" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              <Box className="h-3.5 w-3.5 text-neutral-400" />
              Stock Quantity
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              placeholder="0"
              min="0"
              className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all"
            />
            {createProductState?.errors?.quantity && (
              <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.quantity[0]}</p>
            )}
          </div>
        </div>

        {/* Low Stock Warning Notification Threshold Boundary */}
        <div>
          <label htmlFor="thresholdQuantity" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <Box className="h-3.5 w-3.5 text-neutral-400" />
            Alert Threshold Quantity
          </label>
          <input
            type="number"
            name="thresholdQuantity"
            id="thresholdQuantity"
            placeholder="e.g., 5 (Triggers low stock warnings)"
            min="0"
            className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all"
          />
          {createProductState?.errors?.thresholdQuantity && (
            <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.thresholdQuantity[0]}</p>
          )}
        </div>

        {/* Full Description */}
        <div>
          <label htmlFor="desc" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <FileText className="h-3.5 w-3.5 text-neutral-400" />
            Full Description
          </label>
          <textarea
            name="desc"
            id="desc"
            rows={3}
            placeholder="Elaborate on manufacturing specifications, materials, and dimension overviews..."
            className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all resize-none"
          />
          {createProductState?.errors?.desc && (
            <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.desc[0]}</p>
          )}
        </div>

        {/* Storefront Department Selection Menu */}
        <div>
          <label htmlFor="categoryId" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <FolderOpen className="h-3.5 w-3.5 text-neutral-400" />
            Storefront Department
          </label>
          <div className="relative">
            <select
              name="categoryId"
              id="categoryId"
              className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm bg-stone-50/50 text-neutral-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-neutral-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {createProductState?.errors?.categoryId && (
            <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.categoryId[0]}</p>
          )}
        </div>

        {/* PRIMARY DISPLAY IMAGE CHUNK */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <ImageIcon className="h-3.5 w-3.5 text-neutral-400" />
            Primary Display Image
          </label>

          {featuredImageKeyPreview ? (
            <div className="relative w-full h-52 border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 shadow-inner group">
              <Image src={featuredImageKeyPreview} alt="Featured display thumbnail" fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-transparent to-transparent flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-xs text-white font-medium truncate max-w-[75%]">Primary Catalog Cover</p>
                <button
                  type="button"
                  onClick={clearFeaturedImage}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <label htmlFor="featuredImagePicker" className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-stone-50/50 hover:bg-stone-50 hover:border-amber-400 transition-colors p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <ImageIcon className="h-5 w-5 mb-1.5 text-neutral-400" />
                <p className="text-xs font-semibold text-neutral-700">Upload primary display photo</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">JPEG, PNG or WebP assets up to 5MB</p>
              </div>
              <input
                type="file"
                id="featuredImagePicker"
                className="hidden"
                onChange={handleFeaturedImageKey}
                accept="image/*"
              />
            </label>
          )}
          {createProductState?.errors?.featuredImageKey && (
            <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.featuredImageKey[0]}</p>
          )}
        </div>

        {/* ADDITIONAL MULTI-IMAGE GALLERY STORAGE BLOCKS */}
        <div>
          <label htmlFor="imageGallary" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            <Images className="h-3.5 w-3.5 text-neutral-400" />
            Additional Product Gallery
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {gallaryImagesPreview.map((gallaryImage) => (
              <div key={gallaryImage.id} className="relative aspect-square border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 shadow-xs group">
                <Image src={gallaryImage.imageUrl} alt={gallaryImage.name} fill className="object-cover" />
                <button
                  type="button"
                  onClick={(e) => removeGallaryImageById(e, gallaryImage.id)}
                  className="absolute top-1 right-1 p-1 bg-neutral-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            <label htmlFor="imageGallary" className="flex flex-col items-center justify-center aspect-square border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-stone-50/50 hover:bg-stone-50 hover:border-amber-400 transition-colors p-2 text-center">
              <Images className="h-5 w-5 text-neutral-400 mb-1" />
              <span className="text-[10px] font-semibold text-neutral-600">Add View</span>
              <input
                type="file"
                id="imageGallary"
                className="hidden"
                multiple
                onChange={handleImageGallaryKey}
                accept="image/*"
              />
            </label>
          </div>
          {createProductState?.errors?.gallaryImages && (
            <p className="text-xs text-red-500 mt-1 font-medium">{createProductState.errors.gallaryImages[0]}</p>
          )}
        </div>

        {/* DOM Hidden File Layer Pipeline */}
        <div className="hidden" aria-hidden="true">
          <input
            type="file"
            name="featuredImageKey"
            ref={(el) => {
              if (el) {
                const dataTransfer = new DataTransfer();
                if (featuredImageFile) dataTransfer.items.add(featuredImageFile);
                el.files = dataTransfer.files;
              }
            }}
          />

          {gallaryImagesPreview.map((galleryImage) => (
            <input
              key={galleryImage.id}
              type="file"
              name="galleryImages"
              ref={(el) => {
                if (el) {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(galleryImage.file);
                  el.files = dataTransfer.files;
                }
              }}
            />
          ))}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={createProductPending}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-300 text-white font-semibold text-sm rounded-lg shadow-xs hover:shadow transition-all cursor-pointer text-center"
          >
            {createProductPending ? "Uploading Asset Components..." : "Publish Product To Registry"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProductForm