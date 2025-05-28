"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Partners", href: "/partners" },
  { name: "Profile", href: "/profile" },
];

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="navbar">
      <Link href={"/"}>
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image
            src={"/images/file.svg"}
            alt={"Wizdom.ai"}
            width={45}
            height={45}
          />
        </div>
      </Link>
      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(pathname === item.href && "text-primary font-semibold")}
            >
              <p className="capitalize">{item.name}</p>
            </Link>
          ))}
        </nav>
        <p>Sign In</p>
      </div>
    </nav>
  );
};

export default Navbar;
