import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const { user, logout } = useAuth();


  return (
    <div className="flex h-14 items-center justify-between border-b bg-white px-4">
      <div className="font-semibold text-gray-900">
        Team Task Management
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-sm text-gray-600 sm:block">
          {user?.name || user?.email || ""}
        </div>
        <button
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

