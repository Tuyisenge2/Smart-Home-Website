"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { JwtService } from "@/services/jwtService";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = JwtService.getStoredToken();
  const { isAuthenticated, loading } = useAppSelector((state) => state.google);
  useEffect(() => {
    if ( !JwtService.isTokenValid(token || "") ) {
      router.push("/login");
    }
  }, [ router,token]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return JwtService.isTokenValid(token as string) ? <>{children}</> : null;
}
