import type { FunctionComponent, SVGProps } from "react";
import {
  GridIcon,
  GroupIcon,
  UserIcon,
  TableIcon,
  CalenderIcon,
  CheckCircleIcon,
  DollarLineIcon,
  PageIcon,
  PaperPlaneIcon,
  PieChartIcon,
} from "../icons";

export type SidebarNavItem = {
  label: string;
  to: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
};

export const SIDEBAR_NAV: SidebarNavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: GridIcon },
  { label: "Students", to: "/students", icon: GroupIcon },
  { label: "Staff", to: "/staff", icon: UserIcon },
  { label: "Timetable", to: "/timetable-management", icon: CalenderIcon },
  { label: "Academics", to: "/academics", icon: TableIcon, disabled: true },
  { label: "Attendance", to: "/attendance", icon: CheckCircleIcon, disabled: true },
  { label: "Fees", to: "/fees", icon: DollarLineIcon, disabled: true },
  { label: "Examinations", to: "/examinations", icon: PageIcon, disabled: true },
  { label: "Announcements", to: "/announcements", icon: PaperPlaneIcon, disabled: true },
  { label: "Reports", to: "/reports", icon: PieChartIcon, disabled: true },
];
