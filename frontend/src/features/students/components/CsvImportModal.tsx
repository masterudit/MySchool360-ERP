import { useRef, useState } from "react";
import { parseCsv, validateAndTransform, CSV_TEMPLATE_EXAMPLE, type CsvImportResult } from "../utils/csvParser";
import { getClassLabel } from "../../staff/data/academics";

type Props = {
  onImport: (result: CsvImportResult["valid"]) => void;
  onClose: () => void;
};

type Step = "upload" | "preview" | "done";

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE_EXAMPLE], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "student_import_template.csv"; a.click();
  URL.revokeObjectURL(url);
}

function downloadErrors(errors: CsvImportResult["errors"]) {
  const rows = [
    "row,errors," + Object.keys(errors[0]?.data ?? {}).join(","),
    ...errors.map((e) => [`${e.row}`, `"${e.errors.join("; ")}"`, ...Object.values(e.data).map((v) => `"${v}"`)].join(",")),
  ].join("\n");
  const blob = new Blob([rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "import_errors.csv"; a.click();
  URL.revokeObjectURL(url);
}

export function CsvImportModal({ onImport, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [fileError, setFileError] = useState("");
  const [importedCount, setImportedCount] = useState(0);

  async function handleFile(file: File) {
    setFileError("");
    if (!file.name.endsWith(".csv")) { setFileError("Please upload a .csv file."); return; }
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) { setFileError("The file is empty or has no data rows."); return; }
    const parsed = validateAndTransform(rows);
    setResult(parsed);
    setStep("preview");
  }

  function handleConfirm() {
    if (!result) return;
    onImport(result.valid);
    setImportedCount(result.valid.length);
    setStep("done");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-3xl flex-col rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Import students from CSV</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {step === "upload" && "Upload a CSV file following the required format."}
              {step === "preview" && `${result?.valid.length} valid · ${result?.errors.length} errors`}
              {step === "done" && `${importedCount} students imported successfully.`}
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Close">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "upload" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900/50">
                <svg viewBox="0 0 48 48" className="mx-auto mb-4 size-12 text-gray-300" fill="none" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20L28 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M28 8v12h12M24 24v8M20 28l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-400">Drag & drop or click to select a CSV file</p>
                <input ref={inputRef} type="file" accept=".csv" className="sr-only"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
                <button type="button" onClick={() => inputRef.current?.click()}
                  className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
                  Select CSV file
                </button>
                {fileError && <p className="mt-2 text-xs text-error-500">{fileError}</p>}
              </div>
              <div className="flex items-center justify-between rounded-lg bg-brand-50 p-4 dark:bg-brand-500/10">
                <div>
                  <p className="text-sm font-medium text-brand-700 dark:text-brand-300">Download template</p>
                  <p className="text-xs text-brand-600/70 dark:text-brand-400/70">Includes headers and a sample row</p>
                </div>
                <button type="button" onClick={downloadTemplate}
                  className="rounded-lg border border-brand-300 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 dark:border-brand-500/40 dark:text-brand-300">
                  Download
                </button>
              </div>
            </div>
          )}

          {step === "preview" && result && (
            <div className="space-y-4">
              {result.valid.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-success-600 dark:text-success-400">
                    ✓ {result.valid.length} row{result.valid.length !== 1 ? "s" : ""} ready to import
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50 text-left uppercase tracking-wider text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
                        <tr>
                          {["Admission #", "Name", "Class", "DOB", "Guardian"].map((h) => (
                            <th key={h} className="px-3 py-2 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {result.valid.slice(0, 20).map((row, i) => (
                          <tr key={i} className="bg-success-50/30 dark:bg-success-500/5">
                            <td className="px-3 py-2">{row.admissionNumber}</td>
                            <td className="px-3 py-2">{row.firstName} {row.lastName}</td>
                            <td className="px-3 py-2">{getClassLabel(row.currentClassId)}</td>
                            <td className="px-3 py-2">{row.dateOfBirth}</td>
                            <td className="px-3 py-2">{row.guardians[0]?.firstName} {row.guardians[0]?.lastName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.valid.length > 20 && (
                      <p className="px-3 py-2 text-xs text-gray-500">…and {result.valid.length - 20} more</p>
                    )}
                  </div>
                </div>
              )}

              {result.errors.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-error-600 dark:text-error-400">
                      ✗ {result.errors.length} row{result.errors.length !== 1 ? "s" : ""} with errors (will be skipped)
                    </p>
                    <button type="button" onClick={() => downloadErrors(result.errors)}
                      className="text-xs text-brand-500 hover:underline">Download error report</button>
                  </div>
                  <div className="space-y-1.5">
                    {result.errors.slice(0, 5).map((e) => (
                      <div key={e.row} className="rounded-lg border border-error-200 bg-error-50 p-3 text-xs dark:border-error-500/30 dark:bg-error-500/10">
                        <span className="font-semibold text-error-700 dark:text-error-400">Row {e.row}:</span>{" "}
                        <span className="text-error-600 dark:text-error-400">{e.errors.join("; ")}</span>
                      </div>
                    ))}
                    {result.errors.length > 5 && (
                      <p className="text-xs text-gray-500">…and {result.errors.length - 5} more (download report for full list)</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 grid size-16 place-items-center rounded-full bg-success-50 dark:bg-success-500/10">
                <svg viewBox="0 0 48 48" className="size-8 text-success-500" fill="none" aria-hidden="true">
                  <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5"/>
                  <path d="M14 24l7 7 13-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{importedCount} students imported</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">They are now visible in the student list.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <button type="button" onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
            {step === "done" ? "Close" : "Cancel"}
          </button>
          {step === "preview" && (
            <>
              <button type="button" onClick={() => setStep("upload")}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
                Upload different file
              </button>
              <button type="button" onClick={handleConfirm} disabled={result?.valid.length === 0}
                className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                Import {result?.valid.length} student{result?.valid.length !== 1 ? "s" : ""}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
