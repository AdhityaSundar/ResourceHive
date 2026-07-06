"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, PencilLine, Plus, Trash2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { ResourceCard } from "@/components/resources/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { localizeCategory } from "@/lib/i18n";
import { normalizeResource } from "@/lib/resource-normalization";
import type { Resource, ResourceCategory } from "@/lib/types";

type ResourceFormData = {
  name: string;
  category: ResourceCategory;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  services: string;
  eligibility: string;
};

const categoryOptions: ResourceCategory[] = [
  "Food",
  "Shelter",
  "Jobs",
  "Healthcare",
  "Education",
  "Legal",
  "Youth",
  "Community",
];

function toFormValues(resource?: Resource): ResourceFormData {
  return {
    name: resource?.name ?? "",
    category: resource?.category ?? "Food",
    description: resource?.description ?? "",
    address: resource?.address ?? "",
    city: resource?.city ?? "",
    state: resource?.state ?? "TX",
    zip: resource?.zip ?? "",
    phone: resource?.phone ?? "",
    email: resource?.email ?? "",
    website: resource?.website ?? "",
    hours: resource?.hours ?? "",
    services: resource?.services.join(", ") ?? "",
    eligibility: resource?.eligibility ?? "",
  };
}

export function PreferencesClient({
  initialOwned,
  globalResources,
}: {
  initialOwned: Resource[];
  globalResources: Resource[];
}) {
  const { locale, messages } = useLocale();
  const { saved } = useAuth();
  const t = messages.preferences;
  const [resources, setResources] = useState(initialOwned);
  const [editing, setEditing] = useState<Resource | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<ResourceFormData>({
    defaultValues: toFormValues(),
  });

  function openNew() {
    setEditing(undefined);
    reset(toFormValues());
    setShowForm(true);
  }

  function openEdit(resource: Resource) {
    setEditing(resource);
    reset(toFormValues(resource));
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(undefined);
    reset(toFormValues());
  }

  const sortedResources = useMemo(
    () => [...resources].sort((a, b) => a.name.localeCompare(b.name)),
    [resources],
  );

  // Resolve hearted favorites from everything the user can see (public
  // directory + their own additions). `saved` is newest-first.
  const favorites = useMemo(() => {
    const pool = new Map<string, Resource>();
    for (const resource of [...globalResources, ...resources]) pool.set(resource.id, resource);
    return saved
      .map((item) => pool.get(item.resourceId))
      .filter((resource): resource is Resource => Boolean(resource));
  }, [saved, globalResources, resources]);

  async function onSubmit(values: ResourceFormData) {
    setSaving(true);
    const payload = normalizeResource({
      ...values,
      services: values.services.split(",").map((item) => item.trim()).filter(Boolean),
    });

    const response = await fetch(`/api/my/resources${editing ? `/${editing.id}` : ""}`, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const resource = (await response.json()) as Resource;
      setResources((current) => {
        const others = current.filter((item) => item.id !== (editing?.id ?? resource.id));
        return [resource, ...others];
      });
      closeForm();
    }
    setSaving(false);
  }

  async function removeResource(id: string) {
    const response = await fetch(`/api/my/resources/${id}`, { method: "DELETE" });
    if (response.ok) {
      setResources((current) => current.filter((resource) => resource.id !== id));
      if (editing?.id === id) {
        closeForm();
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-14 sm:px-6 lg:px-8">
      <section className="glass-panel overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_0%_0%,rgba(244,190,78,0.26),transparent_34%),radial-gradient(circle_at_96%_8%,rgba(14,124,134,0.18),transparent_34%),rgba(255,255,255,0.76)] p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-honey-600">{t.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold text-ink">{t.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{t.description}</p>
      </section>

      {/* Favorites (hearted) — dark surface so the frosted glass cards read */}
      <section className="relative overflow-hidden rounded-[32px] bg-teal-900 p-6 sm:p-8">
        <div className="honeycomb-texture-dark pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_0%,rgba(224,133,12,0.16),transparent_55%)]" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-honey-500 text-white shadow-[0_14px_28px_rgba(224,133,12,0.3)]">
            <Heart className="size-5 fill-white text-white" />
          </span>
          <h2 className="text-2xl font-bold text-white">{t.favoritesTitle}</h2>
        </div>
        {favorites.length > 0 ? (
          <div className="relative mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <p className="relative mt-5 rounded-3xl border border-white/12 bg-white/[0.05] p-4 text-sm leading-7 text-teal-50/80">
            {t.favoritesEmpty}
          </p>
        )}
      </section>

      {/* Your own added resources */}
      <section className="glass-panel rounded-[32px] bg-[linear-gradient(145deg,rgba(236,248,248,0.82),rgba(255,255,255,0.76))] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-ink">{t.yourList}</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (showForm && !editing ? closeForm() : openNew())}
            aria-expanded={showForm}
          >
            {showForm && !editing ? (
              <ChevronDown className="mr-2 size-4 rotate-180 transition-transform" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            {messages.common.new}
          </Button>
        </div>

        {/* Collapsible add/edit form — drops down when "New" (or edit) is tapped. */}
        <AnimatePresence initial={false}>
          {showForm ? (
            <motion.div
              key="resource-form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 rounded-[28px] border border-teal-200 bg-white/75 p-5 shadow-e2 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-ink">{editing ? t.editTitle : t.addTitle}</h3>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="text-sm font-semibold text-muted transition hover:text-ink"
                  >
                    {messages.common.cancel}
                  </button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Input placeholder={messages.common.resourceName} {...register("name", { required: true })} />
                  <Select {...register("category")}>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {localizeCategory(category, locale)}
                      </option>
                    ))}
                  </Select>
                  <div className="md:col-span-2">
                    <Input placeholder={messages.common.description} {...register("description", { required: true })} />
                  </div>
                  <Input placeholder={messages.common.address} {...register("address")} />
                  <Input placeholder={messages.common.city} {...register("city", { required: true })} />
                  <Input placeholder={messages.common.state} {...register("state")} />
                  <Input placeholder={messages.common.zip} {...register("zip")} />
                  <Input placeholder={messages.common.phone} {...register("phone")} />
                  <Input placeholder={messages.common.emailAddress} {...register("email")} />
                  <Input placeholder={messages.common.website} {...register("website")} />
                  <Input placeholder={messages.common.hours} {...register("hours")} />
                  <div className="md:col-span-2">
                    <Input placeholder={messages.common.servicesComma} {...register("services")} />
                  </div>
                  <div className="md:col-span-2">
                    <Input placeholder={messages.common.eligibility} {...register("eligibility")} />
                  </div>
                </div>

                <Button type="submit" size="lg" className="mt-6 w-full" disabled={saving}>
                  {saving
                    ? messages.common.saving
                    : editing
                      ? messages.common.updateResource
                      : messages.common.createResource}
                </Button>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-5 space-y-3">
          {sortedResources.length > 0 ? (
            sortedResources.map((resource) => (
              <div key={resource.id} className="relative overflow-hidden rounded-3xl border border-teal-100 bg-white/75 p-4 shadow-e1">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-teal-500" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{resource.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {localizeCategory(resource.category, locale)} · {resource.city}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(resource)}
                      className="rounded-full border border-[var(--border)] bg-white/60 p-2 text-ink-soft transition hover:border-teal-200 hover:text-teal-700"
                    >
                      <PencilLine className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeResource(resource.id)}
                      className="rounded-full border border-[var(--border)] bg-white/60 p-2 text-rose-500 transition hover:border-rose-300 hover:text-rose-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-3xl border border-teal-200 bg-teal-50/80 p-4 text-sm leading-7 text-teal-800">{t.emptyHint}</p>
          )}
        </div>
      </section>
    </div>
  );
}
