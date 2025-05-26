"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { googleSignInSuccess } from "@/store/slices/googleSlice";
import useToast from "./hooks/useToasts";
import { JwtService } from "@/services/jwtService";

function HomeContent() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.google);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const storedToken = JwtService.getStoredToken();

  const dispatch = useAppDispatch();

  const { showErrorMessage, showSuccessMessage } = useToast();

  if (token && token?.length > 2) {
    try {
      JwtService.storeToken(token);
      dispatch(googleSignInSuccess(token));
    } catch (error) {
      showErrorMessage("login by google failed!");
    }
  }

  useEffect(() => {
    if (isAuthenticated && JwtService.isTokenValid(storedToken as string)) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
        <p className='text-gray-600'>Loading...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
