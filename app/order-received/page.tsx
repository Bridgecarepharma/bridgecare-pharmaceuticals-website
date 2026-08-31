import { Suspense } from "react";
import OrderReceived from "./OrderReceivedClient";
export const metadata={title:"Order Received"};
export default function Page(){return <Suspense fallback={<section className="page-hero"><div className="container narrow"><h1>Loading order…</h1></div></section>}><OrderReceived/></Suspense>}
