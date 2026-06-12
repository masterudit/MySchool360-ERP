import { NavLink } from "react-router";
import { SIDEBAR_NAV } from "./sidebarNav";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-800">
          <div className="grid size-9 place-items-center rounded-lg bg-brand-500 text-white">
            <svg viewBox="0 0 48 48" className="size-6" fill="none" aria-hidden="true">
              <path d="M6 19 24 9l18 10-18 10L6 19Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
              <path d="M13 24v10c7 6 15 6 22 0V24M42 19v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">MySchool ERP</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Principal portal</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          <ul className="space-y-1">
            {SIDEBAR_NAV.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <li key={item.label}>
                    <span
                      className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500"
                      title="Coming soon"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-5 fill-current" />
                        {item.label}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        Soon
                      </span>
                    </span>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    <Icon className="size-5 fill-current" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          v0.1.0 · Demo build
        </div>
      </aside>
    </>
  );
}
