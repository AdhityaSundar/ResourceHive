"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { LoaderCircle, PencilLine, Plus, Trash2, Upload } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { localizeCategory } from "@/lib/i18n";
import { normalizeResource } from "@/lib/resource-normalization";
import type { Resource, ResourceCategory } from "@/lib/types";

type ResourceFormData = {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  contactName: string;
  resourceInformation: string;
  info: string;
  website: string;
  hours: string;
  languages: string;
  services: string;
  tags: string;
  latitude: number;
  longitude: number;
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
    id: resource?.id ?? "",
    name: resource?.name ?? "",
    category: resource?.category ?? "Food",
    description: resource?.description ?? "",
    address: resource?.address ?? "",
    city: resource?.city ?? "",
    state: resource?.state ?? "TX",
    zip: resource?.zip ?? "",
    phone: resource?.phone ?? "",
    email: resource?.email ?? "",
    contactName: resource?.contactName ?? "",
    resourceInformation: resource?.resourceInformation ?? "",
    info: resource?.info ?? "",
    website: resource?.website ?? "",
    hours: resource?.hours ?? "",
    languages: resource?.languages.join(", ") ?? "",
    services: resource?.services.join(", ") ?? "",
    tags: resource?.tags.join(", ") ?? "",
    latitude: resource?.latitude ?? 32.7767,
    longitude: resource?.longitude ?? -96.797,
    eligibility: resource?.eligibility ?? "",
  };
}

export function AdminPanelClient({ initialResources }: { initialResources: Resource[] }) {
  const { locale, messages } = useLocale();
  const [resources, setResources] = useState(initialResources);
  const [editing, setEditing] = useState<Resource | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSummary, setUploadSummary] = useState("");
  const { register, handleSubmit, reset } = useForm<ResourceFormData>({
    defaultValues: toFormValues(),
  });

  const sortedResources = useMemo(
    () => [...resources].sort((a, b) => a.name.localeCompare(b.name)),
    [resources],
  );

  async function onSubmit(values: ResourceFormData) {
    setSaving(true);
    const payload = normalizeResource({
      ...values,
      id: values.id || values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      services: values.services.split(",").map((item) => item.trim()).filter(Boolean),
      languages: values.languages.split(",").map((item) => item.trim()).filter(Boolean),
      tags: values.tags.split(",").map((item) => item.trim()).filter(Boolean),
      resourceInformation: values.resourceInformation,
      info: values.info,
      sourceType: editing?.sourceType ?? "manual",
      sourceRef: editing?.sourceRef ?? "admin-panel",
      updatedAt: new Date().toISOString(),
    });

    const response = await fetch(`/api/resources${editing ? `/${editing.id}` : ""}`, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const resource = (await response.json()) as Resource;

    setResources((current) => {
      const others = current.filter((item) => item.id !== (editing?.id ?? resource.id));
      return [resource, ...others];
    });
    setEditing(undefined);
    reset(toFormValues());
    setSaving(false);
  }

  async function removeResource(id: string) {
    await fetch(`/api/resources/${id}`, { method: "DELETE" });
    setResources((current) => current.filter((resource) => resource.id !== id));
    if (editing?.id === id) {
      setEditing(undefined);
      reset(toFormValues());
    }
  }

  async function importSpreadsheet(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSummary("");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/import", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as {
      imported: number;
      skipped: number;
      errors: string[];
    };

    const refreshed = await fetch("/api/resources?page=1&pageSize=200");
    const refreshedData = (await refreshed.json()) as { items: Resource[] };
    setResources(refreshedData.items);
    setUploadSummary(
      `${messages.admin.imported} ${data.imported} ${messages.admin.resources}, ${messages.admin.skipped} ${data.skipped}${
        data.errors.length ? `, ${data.errors.length} ${messages.admin.rowIssues}` : ""
      }.`,
    );
    setUploading(false);
    event.target.value = "";
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-panel rounded-[32px] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">{messages.admin.title}</h1>
            <p className="mt-2 text-sm text-muted">
              {messages.admin.description}
            </p>
          </div>
          <div className="flex gap-2">
            <label className="interactive-glow inline-flex h-10 items-center rounded-full border border-white/40 bg-white/55 px-4 text-sm font-semibold text-ink-soft">
              {uploading ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
              {messages.common.uploadSheet}
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={importSpreadsheet} />
            </label>
            <Button
              variant="secondary"
              onClick={() => {
                setEditing(undefined);
                reset(toFormValues());
              }}
            >
              <Plus className="mr-2 size-4" />
              {messages.common.new}
            </Button>
          </div>
        </div>

        {uploadSummary ? (
          <div className="mt-4 rounded-2xl border border-amber-200/50 bg-amber-50/80 px-4 py-3 text-sm text-amber-700">
            {uploadSummary}
          </div>
        ) : null}

        <div className="mt-5 max-h-[680px] space-y-3 overflow-auto pr-1">
          {sortedResources.map((resource) => (
            <div key={resource.id} className="rounded-3xl border border-white/40 bg-white/55 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-ink">{resource.name}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {localizeCategory(resource.category, locale)} · {resource.city}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(resource);
                      reset(toFormValues(resource));
                    }}
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
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-[32px] p-6">
        <div className="grid gap-4 md:grid-cols-2">
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
          <Input placeholder={messages.common.address} {...register("address", { required: true })} />
          <Input placeholder={messages.common.city} {...register("city", { required: true })} />
          <Input placeholder={messages.common.state} {...register("state", { required: true })} />
          <Input placeholder={messages.common.zip} {...register("zip", { required: true })} />
          <Input placeholder={messages.common.phone} {...register("phone", { required: true })} />
          <Input placeholder={messages.common.emailAddress} {...register("email")} />
          <Input placeholder={messages.common.contactName} {...register("contactName")} />
          <Input placeholder={messages.common.resourceInformation} {...register("resourceInformation")} />
          <Input placeholder={messages.common.info} {...register("info")} />
          <Input placeholder={messages.common.website} {...register("website")} />
          <Input placeholder={messages.common.hours} {...register("hours", { required: true })} />
          <Input placeholder={messages.common.languagesComma} {...register("languages")} />
          <Input placeholder={messages.common.servicesComma} {...register("services")} />
          <Input placeholder={messages.common.tagsComma} {...register("tags")} />
          <Input type="number" step="0.0001" placeholder={messages.common.latitude} {...register("latitude", { valueAsNumber: true })} />
          <Input type="number" step="0.0001" placeholder={messages.common.longitude} {...register("longitude", { valueAsNumber: true })} />
          <div className="md:col-span-2">
            <Input placeholder={messages.common.eligibility} {...register("eligibility", { required: true })} />
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={saving}>
          {saving ? messages.common.saving : editing ? messages.common.updateResource : messages.common.createResource}
        </Button>
      </form>
    </div>
  );
}

