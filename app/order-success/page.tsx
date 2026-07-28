import { Suspense } from "react";
import { OrderSuccessClient } from "@/components/cart/OrderSuccessClient";
export const metadata={title:"Order Confirmed"};
export default function Page(){return <Suspense fallback={<section className="page-hero"><div className="container narrow"><h1>Loading order…</h1></div></section>}><OrderSuccessClient/></Suspense>}
