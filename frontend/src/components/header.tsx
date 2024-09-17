import Image from "next/image";
import Link from "next/link";

const navLinks = [
  {
    href: "login",
    label: "Login",
  },
  {
    href: "register",
    label: "SignUp",
  },
];

export default function Header() {
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
      <nav>
        <ul className="flex gap-x-5 text-white text-[14px]">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:bg-white hover:text-black p-2"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
