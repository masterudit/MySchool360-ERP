import type { AuthenticatedUser, Role } from "../types/auth.types";

type MockUserRecord = {
  password: string;
  user: AuthenticatedUser;
};

const MOCK_USERS: ReadonlyArray<MockUserRecord> = [
  {
    password: "Principal@123",
    user: {
      id: "usr_principal_001",
      schoolId: "sch_demo_001",
      email: "principal@myschool.edu",
      displayName: "Anita Sharma",
      roles: ["PRINCIPAL"] satisfies Role[],
    },
  },
];

export function findMockUser(
  email: string,
  password: string,
): AuthenticatedUser | null {
  const normalized = email.trim().toLowerCase();
  const record = MOCK_USERS.find(
    (entry) =>
      entry.user.email.toLowerCase() === normalized &&
      entry.password === password,
  );
  return record ? record.user : null;
}

export const MOCK_CREDENTIALS_HINT = {
  email: "principal@myschool.edu",
  password: "Principal@123",
};
