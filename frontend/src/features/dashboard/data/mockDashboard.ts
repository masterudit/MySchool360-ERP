export type MetricTone = "neutral" | "positive" | "negative";

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  delta?: string;
  tone?: MetricTone;
  helper?: string;
};

export type AnnouncementItem = {
  id: string;
  title: string;
  audience: string;
  postedBy: string;
  postedAt: string;
};

export type ClassSnapshotRow = {
  className: string;
  section: string;
  students: number;
  attendancePct: number;
  classTeacher: string;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  category: "Examination" | "Holiday" | "Meeting" | "Event";
};

export const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: "students",
    label: "Total Students",
    value: "1,248",
    delta: "+32 this term",
    tone: "positive",
    helper: "Across all classes",
  },
  {
    id: "teachers",
    label: "Total Staff",
    value: "78",
    delta: "4 new joiners",
    tone: "positive",
    helper: "Teaching + admin",
  },
  {
    id: "attendance",
    label: "Today's Attendance",
    value: "92.4%",
    delta: "-1.1% vs yesterday",
    tone: "negative",
    helper: "Class-wise updated 10:30 AM",
  },
  {
    id: "fees",
    label: "Fees Collected (June)",
    value: "₹18.4L",
    delta: "84% of monthly target",
    tone: "neutral",
    helper: "₹3.5L outstanding",
  },
];

export const RECENT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann_001",
    title: "Mid-term examination schedule published",
    audience: "Classes 6 - 10",
    postedBy: "Examination Cell",
    postedAt: "2 hours ago",
  },
  {
    id: "ann_002",
    title: "Parent-teacher meeting on 15 June",
    audience: "All parents",
    postedBy: "Principal's Office",
    postedAt: "Yesterday",
  },
  {
    id: "ann_003",
    title: "Annual sports day registrations open",
    audience: "All students",
    postedBy: "Sports Department",
    postedAt: "2 days ago",
  },
  {
    id: "ann_004",
    title: "Library closed for stock-taking on Friday",
    audience: "School-wide",
    postedBy: "Librarian",
    postedAt: "3 days ago",
  },
];

export const CLASS_SNAPSHOT: ClassSnapshotRow[] = [
  { className: "Class 10", section: "A", students: 42, attendancePct: 95.2, classTeacher: "R. Iyer" },
  { className: "Class 10", section: "B", students: 40, attendancePct: 92.5, classTeacher: "S. Banerjee" },
  { className: "Class 9", section: "A", students: 44, attendancePct: 90.9, classTeacher: "M. Khan" },
  { className: "Class 8", section: "C", students: 38, attendancePct: 88.4, classTeacher: "P. Verma" },
  { className: "Class 7", section: "A", students: 41, attendancePct: 96.1, classTeacher: "N. Pillai" },
];

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: "evt_001", title: "Mid-term exams begin", date: "Mon, 17 Jun", category: "Examination" },
  { id: "evt_002", title: "Parent-teacher meeting", date: "Sat, 15 Jun", category: "Meeting" },
  { id: "evt_003", title: "Founder's Day", date: "Fri, 28 Jun", category: "Event" },
  { id: "evt_004", title: "Term break", date: "1 - 7 Jul", category: "Holiday" },
];
