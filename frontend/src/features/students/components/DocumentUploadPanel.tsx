import { useRef, useState } from "react";
import { DOCUMENT_TYPES } from "../data/studentOptions";
import { DOCUMENT_TYPE_LABELS } from "../utils/display";
import type { StudentDocument, DocumentType } from "../types/student.types";

const MAX_BYTES = 5 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type Props = {
  documents: StudentDocument[];
  onAdd: (doc: Omit<StudentDocument, "id" | "uploadedAt">) => void;
  onRemove: (docId: string) => void;
};

export function DocumentUploadPanel({ documents, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<DocumentType>("BIRTH_CERTIFICATE");
  const [docName, setDocName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (file.size > MAX_BYTES) { setError("File must be smaller than 5 MB."); return; }
    setUploading(true);
    try {
      const dataUrl = await fileToBase64(file);
      onAdd({ name: docName.trim() || file.name, type: selectedType, fileName: file.name, fileDataUrl: dataUrl });
      setDocName("");
    } catch {
      setError("Could not read the file. Please try again.");
    } finally { setUploading(false); }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Upload new document</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Document type *</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as DocumentType)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
              {DOCUMENT_TYPES.map((dt) => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Document name (optional)</label>
            <input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g. Birth Certificate 2015"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
          </div>
        </div>
        <input ref={inputRef} type="file" accept=".pdf,image/*" className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
          {uploading ? "Uploading…" : "Choose file & upload"}
        </button>
        {error && <p className="mt-2 text-xs text-error-500">{error}</p>}
        <p className="mt-2 text-xs text-gray-400">PDF, JPG, PNG · Max 5 MB</p>
      </div>

      {documents.length === 0 ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                  <svg viewBox="0 0 24 24" className="size-5 text-brand-500 fill-none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{doc.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {DOCUMENT_TYPE_LABELS[doc.type]} · {doc.fileName}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <a href={doc.fileDataUrl} download={doc.fileName}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
                  Download
                </a>
                <button type="button" onClick={() => onRemove(doc.id)}
                  className="rounded-lg border border-error-200 bg-error-50 px-3 py-1.5 text-xs font-medium text-error-600 hover:bg-error-100 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
