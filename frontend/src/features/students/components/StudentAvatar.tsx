import type { Student } from "../types/student.types";
import { initials } from "../utils/display";

const SIZES = { sm: "size-9 text-sm", md: "size-12 text-base", lg: "size-20 text-2xl" } as const;

type Props = { student: Pick<Student, "firstName" | "lastName" | "photoUrl">; size?: keyof typeof SIZES; className?: string };

export function StudentAvatar({ student, size = "md", className = "" }: Props) {
  const s = SIZES[size];
  if (student.photoUrl) {
    return (
      <img src={student.photoUrl} alt={`${student.firstName} ${student.lastName}`}
        className={`${s} shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 ${className}`} />
    );
  }
  return (
    <span className={`${s} grid shrink-0 place-items-center rounded-full bg-success-500 font-semibold text-white ${className}`}
      aria-label={`${student.firstName} ${student.lastName}`}>
      {initials(student)}
    </span>
  );
}
