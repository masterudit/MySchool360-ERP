import { Link } from "react-router";

export function CTASection() {
  return (
    <section className="bg-brand-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-500 px-8 py-16 text-center shadow-2xl sm:px-16">
          {/* Background decoration */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-10 -top-10 size-64 rounded-full bg-white/5 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 size-64 rounded-full bg-white/5 blur-3xl" />

          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to modernize your school?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Sign in with your school credentials and get your institution running
            on MySchool ERP today.
          </p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/get-started"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-brand-600 shadow-lg transition hover:bg-brand-50 sm:w-auto"
            >
              Request a demo
              <svg viewBox="0 0 20 20" className="ml-2 size-4 fill-current" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
