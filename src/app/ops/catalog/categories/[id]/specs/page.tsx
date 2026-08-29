import { db } from "@/db";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSpec, deleteSpec } from "./actions";

export default async function SpecsPage({ params }: { params: { id: string } }) {
  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.id, params.id),
    with: {
      specDefinitions: true,
    }
  });

  if (!category) notFound();

  async function addSpecAction(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const dataType = formData.get("dataType") as string;
    const unit = formData.get("unit") as string;
    const isRequired = formData.get("isRequired") === "on";

    await createSpec(params.id, { name, dataType, unit, isRequired });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/ops/catalog/categories"
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{category.name} Specifications</h1>
          <p className="text-zinc-400">Manage technical parameters required for this category.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800/50 border-b border-white/10 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Data Type</th>
              <th className="px-6 py-4 font-medium">Unit</th>
              <th className="px-6 py-4 font-medium">Required</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {category.specDefinitions.map((spec) => (
              <tr key={spec.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-zinc-200">{spec.name}</td>
                <td className="px-6 py-4 text-zinc-400">{spec.dataType}</td>
                <td className="px-6 py-4 text-zinc-400">{spec.unit || "-"}</td>
                <td className="px-6 py-4 text-zinc-400">{spec.isRequired ? "Yes" : "No"}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <form
                      action={async () => {
                        "use server";
                        await deleteSpec(spec.id, params.id);
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
            ))}
            {category.specDefinitions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No specifications defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-medium text-white mb-4">Add New Specification</h2>
        <form action={addSpecAction} className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Name</label>
            <input
              name="name"
              required
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. KV Rating"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Data Type</label>
            <select
              name="dataType"
              required
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="string">Text / String</option>
              <option value="number">Number</option>
              <option value="boolean">Yes / No (Boolean)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Unit (Optional)</label>
            <input
              name="unit"
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. KV, mm, grams"
            />
          </div>
          <div className="space-y-2 flex items-center pt-8">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-300">
              <input type="checkbox" name="isRequired" className="rounded border-white/10 bg-zinc-950" />
              This specification is required
            </label>
          </div>
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Add Specification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
