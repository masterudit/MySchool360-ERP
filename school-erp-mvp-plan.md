# School ERP MVP Plan

## 1. Product Goal

Build a secure, reliable School ERP that allows a school to manage its academic structure, students, attendance, fees, examinations, communication, and parent access from one system.

The first release should serve one school well. Its data model should include a `school_id`/tenant boundary so that supporting multiple schools later does not require a rewrite.

## 2. Recommended Technology Stack

### Frontend

- **React + TypeScript + Vite**
- React Router for application routing
- TanStack Query for API/server-state management
- React Hook Form plus schema validation for forms
- A mature component library such as MUI or Ant Design

**Why:** This is an authenticated, form-heavy business application. React has a strong ecosystem for tables, forms, dashboards, and hiring. Vite provides a fast development and production build setup. Server-side rendering and SEO are not important for the ERP itself, so Next.js would add complexity without much MVP benefit.

### Backend

- **Java with Spring Boot**
- Spring Web for REST APIs
- Spring Security for authentication and authorization
- Spring Data JPA/Hibernate for persistence
- Bean Validation for request validation
- Flyway or Liquibase for database migrations
- OpenAPI for API documentation

Start with a **modular monolith**, organized into clear business modules. Do not begin with microservices.

### Database and Infrastructure

- **PostgreSQL** as the primary database
- S3-compatible object storage for student documents and generated reports
- Redis only when a proven need appears, such as caching or background-job coordination
- Docker Compose for local development
- Managed PostgreSQL and object storage in production
- Automated backups, monitoring, error tracking, and CI/CD

## 3. Core Users and Roles

The MVP should support role-based access control for:

- School administrator
- Office/accounting staff
- Teacher/class teacher
- Student
- Parent/guardian

Permissions must be checked by the backend, not only hidden in the frontend. Allow one user to hold multiple roles where needed.

## 4. MVP Features

### 4.1 Authentication, Authorization, and Security

- Login, logout, password reset, and account activation
- Role-based permissions
- User session management
- School/tenant-level data isolation
- Audit log for sensitive actions
- Secure document access
- Basic privacy controls and data export

### 4.2 School and Academic Setup

- School profile and settings
- Academic years and terms/semesters
- Grades/classes and sections
- Subjects
- Class teacher and subject teacher assignments
- Basic timetable management
- Configurable attendance and grading settings

### 4.3 Student and Guardian Management

- Student admission and enrollment
- Student profile, identifiers, contact details, and status
- Guardian profiles and relationships
- Emergency contacts
- Student document upload
- Class/section assignment and promotion
- CSV import for initial student onboarding

### 4.4 Staff Management

- Basic staff and teacher profiles
- Teacher-to-class and teacher-to-subject assignments
- Active/inactive status

Payroll, leave, recruitment, and performance management are not part of the MVP.

### 4.5 Attendance

- Daily student attendance by class/section
- Present, absent, late, and excused statuses
- Teacher attendance-entry workflow
- Corrections with an audit trail
- Parent/student attendance view
- Basic attendance summaries and reports

### 4.6 Fees and Payments

- Fee categories and fee structures
- Assign fees to a student or class
- Discounts/concessions
- Record offline payments
- Outstanding balance tracking
- Receipts and basic fee reports
- Optional payment gateway integration after the offline workflow is stable

Accounting ledger, procurement, and full financial accounting are not part of the MVP.

### 4.7 Examinations and Report Cards

- Exams and assessment definitions
- Marks/grades entry by teachers
- Configurable grading scale
- Result calculation
- Publish/unpublish results
- Student/parent results view
- Printable or downloadable report card

### 4.8 Announcements and Notifications

- School-wide and class-specific announcements
- Audience targeting by role/class
- In-app notification center
- Email notifications for essential events

SMS, WhatsApp, and push notifications can follow after the core notification workflow is proven.

### 4.9 Portals and Dashboards

- Administrator dashboard with student, attendance, and fee summaries
- Teacher dashboard with assigned classes and pending tasks
- Parent/student portal with attendance, fees, announcements, and results
- Search, filtering, pagination, and CSV export for major administrative lists

### 4.10 Reports

- Student roster
- Daily/monthly attendance
- Fee collection and outstanding fees
- Examination results
- Audit activity

## 5. Explicitly Out of Scope for MVP

- Transport and GPS tracking
- Library management
- Hostel management
- Payroll and HR management
- Inventory and procurement
- Learning management/content delivery
- Video classes
- Alumni management
- Advanced accounting
- Native mobile applications
- Complex custom report builder
- Microservices

These are valuable later, but including them in the MVP would delay validation of the essential school workflows.

## 6. Suggested Backend Modules

Keep one deployable Spring Boot application, with business boundaries such as:

```text
identity
school
academics
students
staff
attendance
fees
examinations
communications
reporting
audit
```

Each module should own its services, APIs, and persistence logic. Avoid allowing controllers or repositories from one module to freely reach into another module.

## 7. Initial Data Model

Important entities include:

- School
- User, Role, Permission, UserRole
- AcademicYear, Term
- Grade/Class, Section, Subject
- Student, Guardian, StudentGuardian, Enrollment
- Staff, TeacherAssignment
- TimetableEntry
- AttendanceRecord
- FeeStructure, StudentFee, Payment, Receipt
- Exam, Assessment, GradeScale, Mark, ReportCard
- Announcement, Notification
- Document
- AuditEvent

Every school-owned record should carry a school/tenant identifier, and uniqueness constraints should be scoped to that identifier.

## 8. API and Engineering Standards

- Version REST endpoints under `/api/v1`
- Validate all input on the backend
- Use consistent error responses and HTTP status codes
- Generate and maintain OpenAPI documentation
- Use database migrations for every schema change
- Add idempotency protection to payment-related operations
- Use optimistic locking where concurrent edits are likely
- Store timestamps in UTC and display them in the school's timezone
- Never store uploaded files directly in PostgreSQL
- Never log passwords, tokens, or sensitive student data

## 9. Delivery Plan

### Phase 0: Discovery and Foundations (1-2 weeks)

- Interview school administrators, teachers, accounts staff, and parents
- Map current admission, attendance, fee, and result workflows
- Define terminology, roles, permissions, and MVP success metrics
- Create wireframes and validate them with one pilot school
- Set up repositories, CI/CD, environments, migrations, logging, and backups

### Phase 1: Identity and Academic Setup (2-3 weeks)

- Authentication and role-based authorization
- School settings, academic years, classes, sections, and subjects
- User and staff management
- Audit logging foundation

### Phase 2: Students and Attendance (3-4 weeks)

- Student admission, guardian records, enrollment, and CSV import
- Teacher assignments and timetable
- Attendance entry, views, and reports

### Phase 3: Fees and Examinations (4-5 weeks)

- Fee structures, student dues, offline payments, receipts, and reports
- Exams, marks entry, grading, results, and report cards

### Phase 4: Portals, Communication, and Pilot (3-4 weeks)

- Parent/student portal
- Announcements and email notifications
- Dashboards and exports
- Security review, performance testing, training, and pilot rollout

Expected MVP delivery: approximately **13-18 weeks** for a focused, experienced small team. The estimate should be revised after workflow discovery.

## 10. Suggested Team

- 1 product owner/business analyst with school-domain access
- 1 product designer, at least part-time
- 1-2 frontend engineers
- 2 backend engineers
- 1 QA engineer
- DevOps support, part-time

A smaller team can build it, but the timeline will increase and scope discipline becomes even more important.

## 11. Definition of Done for MVP

The MVP is ready for a pilot when:

- A school administrator can configure an academic year and onboard users
- Staff can import/enroll students and link guardians
- Teachers can take attendance and enter marks
- Accounts staff can assign fees, record payments, and issue receipts
- Parents can securely view their children's attendance, fees, announcements, and results
- The school can generate essential reports
- Permissions and tenant isolation have automated tests
- Sensitive actions are audited
- Backups and a restore procedure have been tested
- Core workflows work acceptably on mobile-sized browser screens

## 12. Success Metrics

Track during the pilot:

- Percentage of active students successfully onboarded
- Percentage of daily attendance recorded in the ERP
- Time needed to complete attendance and marks entry
- Percentage of fee transactions recorded in the ERP
- Number of support requests per active user
- Parent portal activation and weekly usage
- Data errors and permission/security incidents
- User satisfaction by role

## 13. Key Risks

- **Scope expansion:** Keep deferred modules outside the MVP.
- **Incorrect permissions:** Define and test a permission matrix early.
- **Poor data migration:** Provide validated import templates and error reports.
- **School-specific workflows:** Make grading, fees, and terminology configurable without building a generic workflow engine.
- **Sensitive student data:** Apply least privilege, encryption, audit logs, backups, retention policies, and applicable local privacy requirements.
- **Low adoption:** Pilot with one committed school and train each role using real workflows.

## 14. First Decisions to Make

Before implementation, confirm:

1. Is the initial product for one school, one school group, or a SaaS product for unrelated schools?
2. Which country/state will be served first, and what privacy, tax, and education rules apply?
3. Does the first pilot require online payments, or are recorded offline payments sufficient?
4. Are marks based on one grading system or configurable by grade/subject?
5. Which existing systems or spreadsheets must be imported?
6. What communication channel is essential for the pilot: email, SMS, or WhatsApp?

