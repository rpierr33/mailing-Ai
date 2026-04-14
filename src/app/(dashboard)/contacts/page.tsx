"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  X,
  Star,
  Upload,
  Tag,
  Users,
} from "lucide-react";
import type { Contact } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchContacts = useCallback(async () => {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    setContacts(data.contacts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const allTags = [...new Set(contacts.flatMap((c) => c.tags))];

  const filtered = contacts.filter((c) => {
    if (search && !`${c.firstName} ${c.lastName ?? ""} ${c.email}`.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (tagFilter && !c.tags.includes(tagFilter)) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-6xl animate-pulse">
        <div className="h-10 bg-muted rounded-xl w-full max-w-md" />
        <div className="glass-card rounded-2xl h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-secondary border border-border rounded-xl text-sm w-56 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground cursor-pointer"
          >
            <option value="">All Tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">
            {filtered.length} contacts
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-secondary transition-colors cursor-pointer">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </div>

      {/* Tags row */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(tagFilter === t ? "" : t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tagFilter === t
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "bg-secondary text-muted-foreground border border-border hover:border-muted-foreground/30"
              }`}
            >
              <Tag className="w-3 h-3" />
              {t}
              <span className="text-muted-foreground">
                {contacts.filter((c) => c.tags.includes(t)).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={() =>
                      setSelectedIds(
                        selectedIds.length === filtered.length
                          ? []
                          : filtered.map((c) => c.id)
                      )
                    }
                    className="rounded cursor-pointer accent-brand-500"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                  Tags
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                  Source
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                  Rating
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                  Subscribed
                </th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="rounded cursor-pointer accent-brand-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {getInitials(c.firstName, c.lastName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-md text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {c.source}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3 h-3 ${
                            n <= c.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No contacts found
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 text-sm text-brand-400 hover:text-brand-300 font-medium cursor-pointer"
              >
                Add your first contact
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddContactModal
            onClose={() => setShowAddModal(false)}
            allTags={allTags}
            onAdded={(contact) => {
              setContacts((prev) => [...prev, contact]);
              setShowAddModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddContactModal({
  onClose,
  allTags,
  onAdded,
}: {
  onClose: () => void;
  allTags: string[];
  onAdded: (c: Contact) => void;
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tags: [] as string[],
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [serverError, setServerError] = useState("");

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    setServerError("");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Failed to save contact");
        setSaving(false);
        return;
      }
      if (data.contact) onAdded(data.contact);
    } catch {
      setServerError("Network error. Please try again.");
    }
    setSaving(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md bg-card border-l border-border h-full shadow-xl flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Add Contact</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                First Name
              </label>
              <input
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className={`w-full px-3 py-2 bg-secondary border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-brand-500 ${
                  errors.firstName ? "border-red-500" : "border-border"
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Last Name
              </label>
              <input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`w-full px-3 py-2 bg-secondary border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-brand-500 ${
                errors.email ? "border-red-500" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      tags: f.tags.includes(t)
                        ? f.tags.filter((x) => x !== t)
                        : [...f.tags, t],
                    }))
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    form.tags.includes(t)
                      ? "gradient-bg text-white"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border space-y-2">
          {serverError && (
            <p className="text-sm text-red-400 text-center">{serverError}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2.5 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Contact"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
