import { setSearchQuery } from "@/store/movieSilce";
import { AppDispatch, RootState } from "@/store/store";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  {
    href: "/logout",
    label: "Logout",
  },
];

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const [searchInput, setSearchInput] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      dispatch(setSearchQuery(query));
    }, 100),
    [dispatch]
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    debouncedSearch(query);
  };

  const firstName = useSelector((state: RootState) => state.user.firstName); //setup for profile
  const watchlistCount = useSelector(
    (state: RootState) => state.watchlist.count
  );
  useEffect(() => {
    setIsMounted(true); // Set to true after component mounts
  }, []);

  const goToHome = () => {
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center py-4 px-7 border-b bg-customRed">
      <div className="cursor-pointer" onClick={goToHome}>
        <Image
          src="https://res.cloudinary.com/di835w1z1/image/upload/v1726561472/logo_gdap68.png"
          alt="Logo"
          className="w-[160px] h-[50px]"
          width="160"
          height="50"
        />
      </div>

      {/* Search Form */}
      <div className="relative mx-5">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <img src="/svg/search.svg" alt="Search" className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={handleSearchInput}
          className="bg-customDarkRed text-white pl-10 pr-4 py-1 border rounded-xl w-[200px] sm:w-[300px] focus:outline-none"
        />
      </div>

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
              <li key="addmovie">
                <Link
                  href="/addmovie"
                  className="hover:bg-white hover:text-black p-2"
                >
                  Add Movie
                </Link>
              </li>
              <li key="watchlist">
                <Link
                  href="/watchlist"
                  className="hover:bg-white hover:text-black p-2"
                >
                  WatchList{" "}
                  {watchlistCount ? (
                    <p className="inline bg-yellow-300 p-1 rounded-full text-black">
                      {watchlistCount > 0 ? `${watchlistCount}` : null}
                    </p>
                  ) : (
                    <></>
                  )}
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

//v2 existing faulty serach
// import { setSearchQuery } from "@/store/movieSilce";
// import { AppDispatch, RootState } from "@/store/store";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const navLinks = [
//   {
//     href: "/login",
//     label: "Login",
//   },
//   {
//     href: "/register",
//     label: "SignUp",
//   },
// ];

// const navUserLinks = [
//   {
//     href: "/logout",
//     label: "Logout",
//   },
// ];

// export default function Header() {
//   const [isMounted, setIsMounted] = useState(false);
//   const isAuthenticated = useSelector(
//     (state: RootState) => state.user.isAuthenticated
//   );
//   const router = useRouter();

//   const dispatch = useDispatch<AppDispatch>();
//   const [searchInput, setSearchInput] = useState("");

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     dispatch(setSearchQuery(searchInput));
//   };

//   // const user = getUserCookie();
//   // console.log(user.isAuthenticated);
//   const firstName = useSelector((state: RootState) => state.user.firstName); //setup for profile
//   const watchlistCount = useSelector(
//     (state: RootState) => state.watchlist.count
//   );
//   useEffect(() => {
//     setIsMounted(true); // Set to true after component mounts
//   }, []);

//   const goToHome = () => {
//     router.push("/");
//   };

//   return (
//     <header className="flex justify-between items-center py-4 px-7 border-b bg-customRed">
//       <div className="cursor-pointer" onClick={goToHome}>
//         <Image
//           src="https://res.cloudinary.com/di835w1z1/image/upload/v1726561472/logo_gdap68.png"
//           alt="Logo"
//           className="w-[160px] h-[50px]"
//           width="160"
//           height="50"
//         />
//       </div>

//       {/* Search Form */}
//       <form onChange={handleSearch} className="relative mx-5">
//         <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
//           <img src="/svg/search.svg" alt="Search" className="w-4 h-4" />
//         </span>
//         <input
//           type="text"
//           placeholder="Search"
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           className="bg-customDarkRed text-white pl-10 pr-4 py-2 border rounded-xl w-[200px] sm:w-[300px] focus:outline-none"
//         />
//       </form>

//       <nav>
//         <ul className="flex gap-x-5 text-white text-[14px]">
//           {isMounted && isAuthenticated ? (
//             <>
//               <li key="profile">
//                 <Link
//                   href="profile"
//                   className="hover:bg-white hover:text-black p-2"
//                 >
//                   {firstName}'s profile
//                 </Link>
//               </li>
//               <li key="watchlist">
//                 <Link
//                   href="/watchlist"
//                   className="hover:bg-white hover:text-black p-2"
//                 >
//                   WatchList{" "}
//                   <p className="inline bg-yellow-300 p-1 rounded-3xl text-black">
//                     {watchlistCount > 0 ? `${watchlistCount}` : null}
//                   </p>
//                 </Link>
//               </li>
//               {navUserLinks.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="hover:bg-white hover:text-black p-2"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </>
//           ) : (
//             navLinks.map((link) => (
//               <li key={link.href}>
//                 <Link
//                   href={link.href}
//                   className="hover:bg-white hover:text-black p-2"
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ))
//           )}
//         </ul>
//       </nav>
//     </header>
//   );
// }
