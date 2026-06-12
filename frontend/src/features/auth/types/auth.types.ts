export type Role =
  | "PRINCIPAL"
  | "ADMIN"
  | "OFFICE_STAFF"
  | "TEACHER"
  | "STUDENT"
  | "PARENT";

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type AuthenticatedUser = {
  id: string;
  schoolId: string;
  email: string;
  displayName: string;
  roles: Role[];
};
