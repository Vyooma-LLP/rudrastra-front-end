"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCategory(data: { name: string; slug: string; description: string; parentId?: string }) {
  await db.insert(categories).values({
    name: data.name,
    slug: data.slug,
    description: data.description,
    parentId: data.parentId || null,
  });
  revalidatePath("/ops/catalog/categories");
}

export async function updateCategory(id: string, data: { name: string; slug: string; description: string; parentId?: string; isActive?: boolean }) {
  await db.update(categories)
    .set({
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId || null,
      isActive: data.isActive,
    })
    .where(eq(categories.id, id));
  revalidatePath("/ops/catalog/categories");
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/ops/catalog/categories");
}
