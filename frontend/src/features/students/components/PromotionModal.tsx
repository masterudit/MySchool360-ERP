import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CLASSES } from "../../staff/data/academics";
import { ACADEMIC_YEARS } from "../data/studentOptions";
import { promotionSchema, type PromotionFormValues } from "../schemas/student.schema";
import { getClassLabel } from "../../staff/data/academics";
import { CURRENT_ACADEMIC_YEAR } from "../data/studentOptions";

const inputCls = "h-11 w-full rounded-xl border bg-transparent px-3 text-sm text-gray-800 focus:outline-hidden focus:ring-3 dark:text-white/90 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700";

type Props = {
  studentName: string;
  currentClassId: string;
  onConfirm: (values: PromotionFormValues) => void;
  onClose: () => void;
};

export function PromotionModal({ studentName, currentClassId, onConfirm, onClose }: Props) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: { toClassId: "", academicYear: CURRENT_ACADEMIC_YEAR, remarks: "" },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Promote student</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Promoting <strong>{studentName}</strong> from{" "}
            <strong>{getClassLabel(currentClassId)}</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit(onConfirm)} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Promote to class *
            </label>
            <Controller control={control} name="toClassId" render={({ field }) => (
              <select className={inputCls} value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                <option value="">Select target class</option>
                {CLASSES.filter((c) => c.id !== currentClassId).map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            )} />
            {errors.toClassId && <p className="mt-1 text-xs text-error-500">{errors.toClassId.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Academic year *</label>
            <select className={inputCls} {...register("academicYear")}>
              {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            {errors.academicYear && <p className="mt-1 text-xs text-error-500">{errors.academicYear.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Remarks</label>
            <input className={inputCls} placeholder="Optional note" {...register("remarks")} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
              Confirm promotion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
