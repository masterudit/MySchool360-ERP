import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageMeta from "../../../components/common/PageMeta";
import { getClassLabel } from "../../staff/data/academics";
import { useStudentStore } from "../store/useStudentStore";
import { StudentAvatar } from "../components/StudentAvatar";
import { StudentStatusBadge } from "../components/StudentStatusBadge";
import { PromotionModal } from "../components/PromotionModal";
import { DocumentUploadPanel } from "../components/DocumentUploadPanel";
import { STUDENT_STATUSES, GUARDIAN_RELATIONSHIPS } from "../data/studentOptions";
import { guardianSchema, emergencyContactSchema, type GuardianFormValues, type EmergencyContactFormValues } from "../schemas/student.schema";
import { calcAge, fmtDate, fullName, RELATIONSHIP_LABELS, STATUS_LABELS } from "../utils/display";
import type { Guardian, GuardianRelationship, StudentStatus } from "../types/student.types";

type Tab = "overview" | "guardians" | "documents" | "history";

const inp = "h-10 w-full rounded-lg border bg-transparent px-3 text-sm text-gray-800 focus:outline-hidden focus:ring-3 dark:text-white/90 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700";

/* ── Guardian add form ── */
function GuardianAddForm({ onAdd, onCancel }: { onAdd: (v: GuardianFormValues) => void; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianSchema),
    defaultValues: { firstName: "", lastName: "", relationship: "FATHER", phone: "", email: "", occupation: "", isPrimary: false },
  });
  return (
    <form onSubmit={handleSubmit(onAdd)} className="mt-4 rounded-xl border border-brand-200 bg-brand-50/40 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">Add guardian</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">First name *</label>
          <input className={inp} {...register("firstName")} />
          {errors.firstName && <p className="mt-1 text-xs text-error-500">{errors.firstName.message}</p>}</div>
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Last name *</label>
          <input className={inp} {...register("lastName")} />
          {errors.lastName && <p className="mt-1 text-xs text-error-500">{errors.lastName.message}</p>}</div>
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Relationship *</label>
          <select className={inp} {...register("relationship")}>
            {GUARDIAN_RELATIONSHIPS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select></div>
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Mobile *</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">+91</span>
            <input className={`${inp} pl-9`} type="tel" inputMode="numeric" {...register("phone")} /></div>
          {errors.phone && <p className="mt-1 text-xs text-error-500">{errors.phone.message}</p>}</div>
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Email</label>
          <input className={inp} type="email" {...register("email")} /></div>
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Occupation</label>
          <input className={inp} {...register("occupation")} /></div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="submit" className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-600">Add</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">Cancel</button>
      </div>
    </form>
  );
}

/* ── Emergency contact add form ── */
function EcAddForm({ onAdd, onCancel }: { onAdd: (v: EmergencyContactFormValues) => void; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: { name: "", relationship: "", phone: "" },
  });
  return (
    <form onSubmit={handleSubmit(onAdd)} className="mt-4 rounded-xl border border-warning-200 bg-warning-50/40 p-4 dark:border-warning-500/20 dark:bg-warning-500/5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-warning-600 dark:text-warning-400">Add emergency contact</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Full name *</label>
          <input className={inp} {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name.message}</p>}</div>
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Relationship *</label>
          <input className={inp} placeholder="e.g. Uncle" {...register("relationship")} />
          {errors.relationship && <p className="mt-1 text-xs text-error-500">{errors.relationship.message}</p>}</div>
        <div><label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Mobile *</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">+91</span>
            <input className={`${inp} pl-9`} type="tel" inputMode="numeric" {...register("phone")} /></div>
          {errors.phone && <p className="mt-1 text-xs text-error-500">{errors.phone.message}</p>}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="submit" className="rounded-lg bg-warning-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-warning-600">Add</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">Cancel</button>
      </div>
    </form>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div><dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-800 dark:text-white/90">{value}</dd></div>
  );
}

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, updateStatus, promoteStudent, addGuardian, removeGuardian, setPrimaryGuardian, addEmergencyContact, removeEmergencyContact, addDocument, removeDocument } = useStudentStore();

  const [tab, setTab] = useState<Tab>("overview");
  const [showPromotion, setShowPromotion] = useState(false);
  const [showAddGuardian, setShowAddGuardian] = useState(false);
  const [showAddEc, setShowAddEc] = useState(false);

  const student = id ? getById(id) : undefined;
  if (!student) return <Navigate to="/students" replace />;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "guardians", label: `Guardians & Emergency (${student.guardians.length + student.emergencyContacts.length})` },
    { id: "documents", label: `Documents (${student.documents.length})` },
    { id: "history", label: "Class history" },
  ];

  return (
    <>
      <PageMeta title={`${fullName(student)} | MySchool ERP`} description="Student profile" />

      <div className="mb-6"><Link to="/students" className="text-sm text-brand-500 hover:text-brand-600">← Back to students</Link></div>

      {/* Header */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <StudentAvatar student={student} size="lg" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{fullName(student)}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{getClassLabel(student.currentClassId)}</span>
                {student.rollNumber && <><span>·</span><span>Roll {student.rollNumber}</span></>}
                <span>·</span><span>Adm. {student.admissionNumber}</span>
                <span>·</span><span>Age {calcAge(student.dateOfBirth)}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StudentStatusBadge status={student.status} />
            <select value={student.status} onChange={(e) => updateStatus(student.id, e.target.value as StudentStatus)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {STUDENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button type="button" onClick={() => setShowPromotion(true)}
              className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
              Promote
            </button>
            <Link to={`/students/${student.id}/edit`}
              className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600">
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${tab === t.id ? "bg-brand-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Personal</p>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Full name" value={fullName(student)} />
              <Field label="Date of birth" value={`${fmtDate(student.dateOfBirth)} (Age ${calcAge(student.dateOfBirth)})`} />
              <Field label="Sex" value={student.sex.charAt(0) + student.sex.slice(1).toLowerCase()} />
              <Field label="Blood group" value={student.bloodGroup === "UNKNOWN" ? "Not known" : student.bloodGroup} />
              {student.email && <Field label="Email" value={student.email} />}
              {student.phone && <Field label="Mobile" value={`+91 ${student.phone}`} />}
            </dl>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Admission</p>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Admission no." value={student.admissionNumber} />
              <Field label="Roll no." value={student.rollNumber || "—"} />
              <Field label="Admission date" value={fmtDate(student.admissionDate)} />
              <Field label="Academic year" value={student.academicYear} />
              <Field label="Current class" value={getClassLabel(student.currentClassId)} />
              <Field label="Status" value={STATUS_LABELS[student.status]} />
            </dl>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Address</p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Address" value={[student.address.line1, student.address.line2].filter(Boolean).join(", ")} />
              <Field label="City" value={student.address.city} />
              <Field label="State / UT" value={student.address.state} />
              <Field label="Pincode" value={student.address.pincode} />
            </dl>
          </div>
        </div>
      )}

      {/* Guardians & Emergency */}
      {tab === "guardians" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Guardians ({student.guardians.length})
              </p>
              <button type="button" onClick={() => setShowAddGuardian((v) => !v)}
                className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
                + Add guardian
              </button>
            </div>
            {student.guardians.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No guardians added yet.</p>}
            <div className="space-y-3">
              {student.guardians.map((g: Guardian) => (
                <div key={g.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-white/90">{g.firstName} {g.lastName}</span>
                      {g.isPrimary && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">Primary</span>}
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">{RELATIONSHIP_LABELS[g.relationship]}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">+91 {g.phone}{g.email ? ` · ${g.email}` : ""}{g.occupation ? ` · ${g.occupation}` : ""}</p>
                  </div>
                  <div className="flex gap-2">
                    {!g.isPrimary && (
                      <button type="button" onClick={() => setPrimaryGuardian(student.id, g.id)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
                        Set primary
                      </button>
                    )}
                    {student.guardians.length > 1 && (
                      <button type="button" onClick={() => removeGuardian(student.id, g.id)}
                        className="rounded-lg border border-error-200 bg-error-50 px-3 py-1.5 text-xs text-error-600 hover:bg-error-100 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {showAddGuardian && (
              <GuardianAddForm
                onAdd={(v) => { addGuardian(student.id, { ...v, relationship: v.relationship as GuardianRelationship, email: v.email || undefined, occupation: v.occupation || undefined }); setShowAddGuardian(false); }}
                onCancel={() => setShowAddGuardian(false)}
              />
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Emergency contacts ({student.emergencyContacts.length})
              </p>
              <button type="button" onClick={() => setShowAddEc((v) => !v)}
                className="rounded-lg border border-warning-200 bg-warning-50 px-3 py-1.5 text-xs font-medium text-warning-600 hover:bg-warning-100 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-300">
                + Add contact
              </button>
            </div>
            {student.emergencyContacts.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No emergency contacts added yet.</p>}
            <div className="space-y-3">
              {student.emergencyContacts.map((ec) => (
                <div key={ec.id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white/90">{ec.name} <span className="ml-1 text-xs font-normal text-gray-500">({ec.relationship})</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+91 {ec.phone}</p>
                  </div>
                  <button type="button" onClick={() => removeEmergencyContact(student.id, ec.id)}
                    className="rounded-lg border border-error-200 bg-error-50 px-3 py-1.5 text-xs text-error-600 hover:bg-error-100 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {showAddEc && (
              <EcAddForm
                onAdd={(v) => { addEmergencyContact(student.id, v); setShowAddEc(false); }}
                onCancel={() => setShowAddEc(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* Documents */}
      {tab === "documents" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Student documents</p>
          <DocumentUploadPanel
            documents={student.documents}
            onAdd={(doc) => addDocument(student.id, doc)}
            onRemove={(docId) => removeDocument(student.id, docId)}
          />
        </div>
      )}

      {/* Class history */}
      {tab === "history" && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Class history</p>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Academic year</th>
                <th className="px-6 py-3 font-medium">From</th>
                <th className="px-6 py-3 font-medium">To</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {[...student.classHistory].reverse().map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{entry.academicYear}</td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{entry.fromClassId ? getClassLabel(entry.fromClassId) : "—"}</td>
                  <td className="px-6 py-3 font-medium text-gray-800 dark:text-white/90">{getClassLabel(entry.toClassId)}</td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{fmtDate(entry.promotedAt)}</td>
                  <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{entry.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPromotion && (
        <PromotionModal
          studentName={fullName(student)}
          currentClassId={student.currentClassId}
          onConfirm={(form) => { promoteStudent(student.id, form); setShowPromotion(false); }}
          onClose={() => setShowPromotion(false)}
        />
      )}
    </>
  );
}
