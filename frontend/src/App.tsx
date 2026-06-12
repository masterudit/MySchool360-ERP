import { Navigate, Route, Routes } from "react-router";
import { HomePage } from "./pages/home/HomePage";
import { GetStartedPage } from "./pages/get-started/GetStartedPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import { PrincipalDashboardPage } from "./features/dashboard/pages/PrincipalDashboardPage";
import { StaffStoreProvider } from "./features/staff/store/StaffStoreProvider";
import { StaffListPage } from "./features/staff/pages/StaffListPage";
import { StaffNewPage } from "./features/staff/pages/StaffNewPage";
import { StaffDetailPage } from "./features/staff/pages/StaffDetailPage";
import { StaffEditPage } from "./features/staff/pages/StaffEditPage";
import { StudentStoreProvider } from "./features/students/store/StudentStoreProvider";
import { StudentListPage } from "./features/students/pages/StudentListPage";
import { StudentNewPage } from "./features/students/pages/StudentNewPage";
import { StudentDetailPage } from "./features/students/pages/StudentDetailPage";
import { StudentEditPage } from "./features/students/pages/StudentEditPage";
import { TimetableStoreProvider } from "./features/timetable/store/TimetableStoreProvider";
import { TimetableManagementPage } from "./features/timetable/pages/TimetableManagementPage";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/get-started" element={<GetStartedPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — school workspace */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["PRINCIPAL", "ADMIN"]}>
            <StaffStoreProvider>
              <StudentStoreProvider>
                <TimetableStoreProvider>
                  <AppLayout />
                </TimetableStoreProvider>
              </StudentStoreProvider>
            </StaffStoreProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<PrincipalDashboardPage />} />

        {/* Staff */}
        <Route path="/staff" element={<StaffListPage />} />
        <Route path="/staff/new" element={<StaffNewPage />} />
        <Route path="/staff/:id" element={<StaffDetailPage />} />
        <Route path="/staff/:id/edit" element={<StaffEditPage />} />

        {/* Students */}
        <Route path="/students" element={<StudentListPage />} />
        <Route path="/students/new" element={<StudentNewPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
        <Route path="/students/:id/edit" element={<StudentEditPage />} />

        {/* Timetable */}
        <Route path="/timetable-management" element={<TimetableManagementPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
