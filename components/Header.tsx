"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Truck, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/data/site";
import { CartLink } from "@/components/cart/CartLink";

function TruckIcon(){ return <Truck size={15} aria-hidden="true"/>; }

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="delivery-announcement"><div className="container"><TruckIcon /> <strong>FREE nationwide delivery on 4+ packs</strong><span>Regional delivery from ₦3,500 for smaller orders</span></div></div>
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
      <div className="shop-nav-bar" aria-label="Shop categories">
        <div className="container shop-nav-inner">
          <Link href="/products"><strong>SHOP ALL</strong></Link>
          <Link href="/products/asfenositol">WOMEN’S HEALTH</Link>
          <Link href="/products/aspivit">DAILY NUTRITION</Link>
          <Link href="/products/globivida">BLOOD &amp; VITALITY</Link>
          <Link href="/products/herbal-bitter-tea">HERBAL WELLNESS</Link>
          <Link href="/health-centre">HEALTH CENTRE</Link>
        </div>
      </div>
    </header>
  );
}
