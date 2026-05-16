import { Outlet, NavLink, useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" }
];

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="flex">
        <aside className="w-64 hidden border-r bg-white lg:block">
          <div className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Navigation
            </div>
            <nav className="mt-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              className="mt-6 w-full rounded-md border border-dashed px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              onClick={() => navigate("/tasks")}
            >
              Create or manage tasks
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

