"use client";
import { createContext,useContext,useEffect,useMemo,useState } from "react";
export type CartItem={slug:string;name:string;priceKobo:number;quantity:number};
type CartContextValue={items:CartItem[];count:number;subtotalKobo:number;add:(item:Omit<CartItem,"quantity">)=>void;remove:(slug:string)=>void;setQuantity:(slug:string,quantity:number)=>void;clear:()=>void};
const CartContext=createContext<CartContextValue|null>(null);
export function CartProvider({children}:{children:React.ReactNode}){
 const [items,setItems]=useState<CartItem[]>([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem("bridgecare-cart");if(raw)setItems(JSON.parse(raw))}finally{setReady(true)}},[]);
 useEffect(()=>{if(ready)localStorage.setItem("bridgecare-cart",JSON.stringify(items))},[items,ready]);
 const value=useMemo(()=>({
  items,count:items.reduce((n,i)=>n+i.quantity,0),subtotalKobo:items.reduce((n,i)=>n+i.priceKobo*i.quantity,0),
  add:(item:Omit<CartItem,"quantity">)=>setItems(current=>{const found=current.find(x=>x.slug===item.slug);return found?current.map(x=>x.slug===item.slug?{...x,quantity:Math.min(20,x.quantity+1)}:x):[...current,{...item,quantity:1}]}),
  remove:(slug:string)=>setItems(current=>current.filter(x=>x.slug!==slug)),
  setQuantity:(slug:string,quantity:number)=>setItems(current=>current.map(x=>x.slug===slug?{...x,quantity:Math.max(1,Math.min(20,quantity))}:x)),
  clear:()=>setItems([])
 }),[items]);
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export function useCart(){const value=useContext(CartContext);if(!value)throw new Error("useCart must be used within CartProvider");return value}
