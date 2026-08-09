"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/data/site";
import { CartLink } from "@/components/cart/CartLink";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-accent" />
      <div className="container nav-wrap">
        <Link href="/" className="brand brand-official" aria-label="Bridgecare Pharmaceuticals Limited home">
          <Image
            src="/images/brand/bridgecare-logo.png"
            alt="Bridgecare Pharmaceuticals Limited"
            width={260}
            height={158}
            className="official-header-logo"
            priority
          />
        </Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
        <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <Link className="nav-search" href="/search" aria-label="Search"><Search size={19} /></Link>
          <Link className="button small distributor-button" href="/distributors">Become a Distributor</Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
