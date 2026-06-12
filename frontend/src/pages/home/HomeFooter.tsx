import { Link } from "react-router";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Modules", href: "#modules" },
  ],
  Support: [
    { label: "Documentation", href: "#" },
    { label: "Contact us", href: "#" },
    { label: "System status", href: "#" },
  ],
  Legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export function HomeFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-brand-500 text-white">
                <svg viewBox="0 0 48 48" className="size-6" fill="none" aria-hidden="true">
                  <path d="M6 19 24 9l18 10-18 10L6 19Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M13 24v10c7 6 15 6 22 0V24M42 19v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-base font-bold text-white">
                MySchool <span className="text-brand-400">ERP</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-gray-500">
              A secure, multi-school ERP platform built for Indian educational institutions.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-300">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 transition hover:text-gray-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} MySchool ERP. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Data stored securely · School-isolated · India-first
          </p>
        </div>
      </div>
    </footer>
  );
}
