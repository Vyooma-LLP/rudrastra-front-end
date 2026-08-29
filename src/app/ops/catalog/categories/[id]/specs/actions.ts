"use server";
import { db } from "@/db";
import { specDefinitions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSpec(categoryId: string, data: { name: string; dataType: string; unit?: string; isRequired: boolean }) {
  await db.insert(specDefinitions).values({
    categoryId,
    name: data.name,
    dataType: data.dataType,
    unit: data.unit || null,
    isRequired: data.isRequired,
  });
  revalidatePath(`/ops/catalog/categories/${categoryId}/specs`);
}

export async function deleteSpec(specId: string, categoryId: string) {
  await db.delete(specDefinitions).where(eq(specDefinitions.id, specId));
  revalidatePath(`/ops/catalog/categories/${categoryId}/specs`);
}
