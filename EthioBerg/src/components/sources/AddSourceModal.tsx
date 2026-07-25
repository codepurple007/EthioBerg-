"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AddSourceInput, TrustClass } from "@/lib/types";
import { computeFileChecksum } from "@/lib/sources/labels";
import { X } from "lucide-react";

const defaultForm: AddSourceInput = {
  title: "",
  issuingBody: "ECMA",
  version: "",
  publicationDate: "",
  effectiveFrom: "",
  effectiveTo: null,
  language: "en",
  url: "",
  checksum: "",
  trustClass: "official_regulatory",
};

type AddSourceModalProps = {
  open: boolean;
  duplicateWarning?: boolean;
  onClose: () => void;
  onSubmit: (input: AddSourceInput, forceDuplicate: boolean) => void;
};

export default function AddSourceModal({
  open,
  duplicateWarning = false,
  onClose,
  onSubmit,
}: AddSourceModalProps) {
  const [form, setForm] = useState<AddSourceInput>(defaultForm);
  const [fileName, setFileName] = useState("");
  const [hashing, setHashing] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setFileName("");
    }
  }, [open]);

  if (!open) return null;

  async function handleFileChange(file: File | null) {
    if (!file) return;
    setFileName(file.name);
    setHashing(true);
    try {
      const checksum = await computeFileChecksum(file);
      setForm((prev) => ({ ...prev, checksum }));
    } finally {
      setHashing(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.title || !form.version || !form.checksum) return;
    onSubmit(form, duplicateWarning);
  }

  function updateField<K extends keyof AddSourceInput>(key: K, value: AddSourceInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <div className="card-header">
          <h5 className="card-title">Add official source</h5>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#878a99] hover:bg-[#f3f6f9]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <form className="card-body space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Issuing body *
              </label>
              <select
                value={form.issuingBody}
                onChange={(e) =>
                  updateField("issuingBody", e.target.value as AddSourceInput["issuingBody"])
                }
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                <option value="ECMA">ECMA</option>
                <option value="ESX">ESX</option>
                <option value="FDRE">FDRE</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Version *</label>
              <input
                required
                value={form.version}
                onChange={(e) => updateField("version", e.target.value)}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Trust class *
              </label>
              <select
                value={form.trustClass}
                onChange={(e) => updateField("trustClass", e.target.value as TrustClass)}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                <option value="official_regulatory">Official regulatory</option>
                <option value="official_issuer_filing">Official issuer filing</option>
                <option value="user_draft">User draft</option>
                <option value="synthetic_fixture">Synthetic fixture</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Language *</label>
              <select
                value={form.language}
                onChange={(e) => updateField("language", e.target.value as "en" | "am")}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                <option value="en">English</option>
                <option value="am">Amharic</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Publication date *
              </label>
              <input
                required
                type="date"
                value={form.publicationDate}
                onChange={(e) => updateField("publicationDate", e.target.value)}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Effective from *
              </label>
              <input
                required
                type="date"
                value={form.effectiveFrom}
                onChange={(e) => updateField("effectiveFrom", e.target.value)}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Effective to
              </label>
              <input
                type="date"
                value={form.effectiveTo ?? ""}
                onChange={(e) =>
                  updateField("effectiveTo", e.target.value ? e.target.value : null)
                }
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Official URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://"
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Source file (PDF/DOCX) *
              </label>
              <input
                required
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                className="w-full text-[13px]"
              />
              {fileName && (
                <p className="mt-1 mb-0 text-[12px] text-[#878a99]">
                  {fileName}
                  {hashing ? " — computing checksum…" : form.checksum ? " — checksum ready" : ""}
                </p>
              )}
            </div>
            {form.checksum && (
              <div className="md:col-span-2">
                <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                  SHA-256 checksum
                </label>
                <input
                  readOnly
                  value={form.checksum}
                  className="w-full rounded border border-[#e9ebec] bg-[#f8f9fa] px-3 py-2 font-mono text-[11px] outline-none"
                />
              </div>
            )}
          </div>

          {duplicateWarning && (
            <div className="rounded border border-[#f7b84b] bg-[#fef4e4] px-3 py-2 text-[12px] text-[#856404]">
              Duplicate checksum detected. Submit again to create a separate version record anyway.
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-[#e9ebec] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-[#e9ebec] bg-white px-4 py-2 text-[13px] text-[#495057] hover:bg-[#f8f9fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.checksum || hashing}
              className="cursor-pointer rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574] disabled:opacity-50"
            >
              {duplicateWarning ? "Confirm add version" : "Add source"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
