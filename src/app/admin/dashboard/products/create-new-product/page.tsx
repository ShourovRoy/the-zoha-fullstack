import CreateProductForm from "@/components/admin/create-product-form";
import { CategoriesOptions } from "./_components/categories-options";
import { Suspense } from "react";

export default function CreateNewProduct() {
  return (
    <div>
      <CreateProductForm>
        <Suspense fallback={<p>Loading categories...</p>} >
          <CategoriesOptions />
        </Suspense>
      </CreateProductForm>
    </div>
  );
}
