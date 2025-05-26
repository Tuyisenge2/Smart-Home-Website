"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { JwtService } from "@/services/jwtService";
import { Avatar } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("auth_token");
    if (token) {
      const userData = JwtService.getTokenData(token);
      setUserRole(userData?.role || "");
      setUserEmail(userData?.email || "");
      setUserName(userData?.name || userData?.email?.split("@")[0] || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }
  const userAdmin = () => {
    if (userRole === "ADMIN" || userEmail === "tuyisengetito0@gmail.com") {
      return true;
    }
    return false;
  };
  return (
    <ProtectedRoute>
      <div className='flex min-h-screen' suppressHydrationWarning>
        {/* Sidebar */}
        <aside className='fixed left-0 top-0 w-64 bg-gray-800 text-white p-4 flex flex-col h-screen'>
          <div className='flex-1 overflow-y-auto'>
            <h2 className='text-xl font-bold mb-6'>Employee Dashboard</h2>
            <nav className='space-y-2'>
              <Link
                href='/dashboard'
                className={`block p-2 rounded ${
                  pathname === "/dashboard"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Overview
              </Link>
              <Link
                href='/dashboard/apply-leave'
                className={`block p-2 rounded ${
                  pathname === "/dashboard/apply-leave"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Apply Leave
              </Link>
              <Link
                href='/dashboard/leave-history'
                className={`block p-2 rounded ${
                  pathname === "/dashboard/leave-history"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Leave History
              </Link>
              <Link
                href='/dashboard/users'
                className={`block p-2 rounded ${
                  pathname === "/dashboard/leave-types"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Users
              </Link>
              {userAdmin() && (
                <>
                  <Link
                    href='/dashboard/leave-approvals'
                    className={`block p-2 rounded ${
                      pathname === "/dashboard/leave-approvals"
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    Leave Approvals
                  </Link>
                  <Link
                    href='/dashboard/leave-types'
                    className={`block p-2 rounded ${
                      pathname === "/dashboard/leave-types"
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    Leave Types
                  </Link>
                </>
              )}

              <Link
                href='/dashboard/colleagues-on-leave'
                className={`block p-2 rounded ${
                  pathname === "/dashboard/colleagues-on-leave"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Colleagues on Leave
              </Link>
            </nav>
          </div>

          {/* User Profile Section */}
          <div className='pt-4 border-t border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <Avatar
                src={`https://ui-avatars.com/api/?name=${userName}&background=random`}
                alt={userName}
                className='w-10 h-10'
              />
              <div>
                <p className='font-medium text-sm'>{userName}</p>
                <p className='text-xs text-gray-400'>{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className='w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center gap-2'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 ml-64 p-8 bg-gray-100 min-h-screen'>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
