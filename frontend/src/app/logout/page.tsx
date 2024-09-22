"use client";
import { logout } from "@/store/userSlice";
import { clearWatchlist } from "@/store/watchlistSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default function LogoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isFetching = useRef(false);
  useEffect(() => {
    const performLogout = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      await dispatch(clearWatchlist());
      await dispatch(logout());
      router.push("/");
    };

    performLogout();
  }, [dispatch, router]);
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-bold">Logging out...</h1>
    </div>
  );
}
