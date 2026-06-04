"use client";

import { FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Listing, ListingInput } from "@/types/listing";

const EMPTY_FORM: ListingInput = {
  title: "",
  description: "",
  price: 0,
  location: "",
  bedrooms: 2,
  bathrooms: 1,
  image_url: "",
};

type Props = {
  listings: Listing[];
  onAdd: (input: ListingInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function AdminDashboard({ listings, onAdd, onDelete }: Props) {
  const [form, setForm] = useState<ListingInput>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim()) return;

    setSubmitting(true);
    try {
      await onAdd({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        image_url: form.image_url.trim(),
      });
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Add Property</h2>
        <p className="mt-1 text-sm text-slate-500">Create a new listing for the portal.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Title" required>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Sector 17 Premium Apartment"
              required
            />
          </Field>

          <Field label="Description">
            <textarea
              className={`${inputClass} min-h-[88px] resize-y`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the property..."
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price (INR)" required>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                placeholder="12500000"
                required
              />
            </Field>
            <Field label="Location" required>
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Sector 17, Chandigarh"
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Bedrooms">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
              />
            </Field>
            <Field label="Bathrooms">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="Image URL">
            <input
              className={inputClass}
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
            <p className="mt-1 text-xs text-slate-400">Leave empty to use a placeholder image.</p>
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {submitting ? "Adding..." : "Add Listing"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Your Listings</h2>
            <p className="mt-1 text-sm text-slate-500">{listings.length} properties</p>
          </div>
        </div>

        {listings.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            No listings yet. Add your first property using the form.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Property</th>
                  <th className="pb-3 pr-4 font-medium">Location</th>
                  <th className="pb-3 pr-4 font-medium">Price</th>
                  <th className="pb-3 pr-4 font-medium">Beds/Baths</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 pr-4 font-medium text-slate-900">{listing.title}</td>
                    <td className="py-4 pr-4 text-slate-600">{listing.location}</td>
                    <td className="py-4 pr-4 font-medium text-brand-700">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">
                      {listing.bedrooms} bd · {listing.bathrooms} ba
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(listing.id)}
                        disabled={deletingId === listing.id}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === listing.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20";