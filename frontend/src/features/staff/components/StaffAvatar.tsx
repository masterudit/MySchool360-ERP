import type { StaffMember } from "../types/staff.types";
import { formatInitials } from "../utils/display";

const SIZE_CLASSES = {
  sm: "size-9 text-sm",
  md: "size-12 text-base",
  lg: "size-20 text-2xl",
} as const;

type Size = keyof typeof SIZE_CLASSES;

type StaffAvatarProps = {
  staff: Pick<StaffMember, "firstName" | "lastName" | "photoUrl">;
  size?: Size;
  className?: string;
};

export function StaffAvatar({ staff, size = "md", className = "" }: StaffAvatarProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (staff.photoUrl) {
    return (
      <img
        src={staff.photoUrl}
        alt={`${staff.firstName} ${staff.lastName}`}
        className={`${sizeClass} shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} grid shrink-0 place-items-center rounded-full bg-brand-500 font-semibold text-white ${className}`}
      aria-label={`${staff.firstName} ${staff.lastName}`}
    >
      {formatInitials(staff)}
    </span>
  );
}
