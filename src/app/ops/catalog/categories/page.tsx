import { db } from "@/db";
import { categories } from "@/db/schema";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { createCategory, updateCategory, deleteCategory } from "./actions";
import { revalidatePath } from "next/cache";

export default async function CategoriesPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  // Group by parent
  const topLevel = allCategories.filter((c) => !c.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
          <p className="text-zinc-400">Manage hierarchical product taxonomy.</p>
        </div>
        <Link
          href="/ops/catalog/categories/new"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-800/50 border-b border-white/10 text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topLevel.map((cat) => (
                <CategoryRow key={cat.id} category={cat} allCategories={allCategories} depth={0} />
              ))}
              {topLevel.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  category,
  allCategories,
  depth,
}: {
  category: any;
  allCategories: any[];
  depth: number;
}) {
  const children = allCategories.filter((c) => c.parentId === category.id);
  const paddingLeft = `${depth * 2 + 1.5}rem`;

  return (
    <>
      <tr className="hover:bg-white/5 transition-colors group">
        <td className="px-6 py-4" style={{ paddingLeft }}>
          <div className="flex items-center gap-2">
            {depth > 0 && <span className="text-zinc-600">↳</span>}
            <span className="font-medium text-zinc-200">{category.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-zinc-400">{category.slug}</td>
        <td className="px-6 py-4 text-zinc-400">{category.description || "-"}</td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              category.isActive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-zinc-500/10 text-zinc-400"
            }`}
          >
            {category.isActive ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link 
              href={`/ops/catalog/categories/${category.id}/specs`}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-xs font-medium text-zinc-300 transition-colors border border-white/10"
            >
              Specs
            </Link>
            <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <form
              action={async () => {
                "use server";
                await deleteCategory(category.id);
              }}
            >
              <button
                type="submit"
                className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        </td>
      </tr>
      {children.map((child) => (
        <CategoryRow
          key={child.id}
          category={child}
          allCategories={allCategories}
          depth={depth + 1}
        />
      ))}
    </>
  );
}
