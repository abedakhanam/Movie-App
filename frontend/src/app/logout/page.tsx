"use client";
import { logout } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function LogoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(logout());
    router.push("/");
  }, [dispatch, router]);
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-bold">Logging out...</h1>
    </div>
  );
}
