"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/ops/catalog/products/actions";

export function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${productName}? This will permanently remove all variants and specs.`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 inline-flex items-center gap-1"
      title="Delete Product"
    >
      <Trash2 className="w-3 h-3" />
      {isDeleting ? "..." : "Delete"}
    </button>
  );
}
