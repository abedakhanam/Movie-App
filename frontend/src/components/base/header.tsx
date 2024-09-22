import { RootState } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const navLinks = [
  {
    href: "/login",
    label: "Login",
  },
  {
    href: "/register",
    label: "SignUp",
  },
];

const navUserLinks = [
  // {
  //   href: "/watchlist",
  //   label: "WatchList",
  // },
  {
    href: "/logout",
    label: "Logout",
  },
];

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  // const user = getUserCookie();
  // console.log(user.isAuthenticated);
  const firstName = useSelector((state: RootState) => state.user.firstName); //setup for profile
  const watchlistCount = useSelector(
    (state: RootState) => state.watchlist.count
  );
  useEffect(() => {
    setIsMounted(true); // Set to true after component mounts
  }, []);
  return (
    <header className="flex justify-between items-center py-4 px-7 border-b bg-customRed">
      <Link href="/">
        <Image
          src="https://res.cloudinary.com/di835w1z1/image/upload/v1726561472/logo_gdap68.png"
          alt="Logo"
          className="w-[160px] h-[50px]"
          width="160"
          height="50"
        />
      </Link>

      {/* Search Form */}
      <form className="relative mx-5">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <img src="/svg/search.svg" alt="Search" className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search"
          className="bg-customDarkRed text-white pl-10 pr-4 py-2 border rounded-xl w-[200px] sm:w-[300px] focus:outline-none"
        />
      </form>

      <nav>
        <ul className="flex gap-x-5 text-white text-[14px]">
          {isMounted && isAuthenticated ? (
            <>
              <li key="profile">
                <Link
                  href="profile"
                  className="hover:bg-white hover:text-black p-2"
                >
                  {firstName}'s profile
                </Link>
              </li>
              <li key="watchlist">
                <Link
                  href="/watchlist"
                  className="hover:bg-white hover:text-black p-2"
                >
                  WatchList{" "}
                  <p className="inline bg-yellow-300 p-1 rounded-3xl text-black">
                    {watchlistCount > 0 ? `${watchlistCount}` : null}
                  </p>
                </Link>
              </li>
              {navUserLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:bg-white hover:text-black p-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </>
          ) : (
            navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:bg-white hover:text-black p-2"
                >
                  {link.label}
                </Link>
              </li>
            ))
          )}
        </ul>
      </nav>
    </header>
  );
}
