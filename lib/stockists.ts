import { z } from "zod";
import { PRODUCTS } from "@/data/products";

export const NIGERIAN_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","Abuja (FCT)"] as const;
const phone = z.string().trim().max(30).regex(/^\+?[\d ()-]{7,30}$/, "Enter a valid telephone number.").refine(v => v.replace(/\D/g, "").length >= 7 && v.replace(/\D/g, "").length <= 15, "Enter a valid telephone number.");
const products = new Set(PRODUCTS.map(product => product.slug));
export const stockistSchema = z.object({
  name: z.string().trim().min(2).max(120),
  address: z.string().trim().min(5).max(240),
  city: z.string().trim().min(2).max(80),
  state: z.enum(NIGERIAN_STATES),
  phone,
  whatsapp: z.union([z.literal(""), phone]).default(""),
  productSlugs: z.array(z.string().refine(slug => products.has(slug), "Select a Bridgecare product.")).max(PRODUCTS.length).transform(slugs => [...new Set(slugs)]),
  openingHours: z.string().trim().max(180).default(""),
  isActive: z.boolean().default(false),
});
export type StockistInput = z.infer<typeof stockistSchema>;
export type PublicStockist = Omit<StockistInput, "state"> & { id: string; state: string };
export function phoneHref(value: string) { return `tel:${value.replace(/[^\d+]/g, "")}`; }
export function whatsappHref(value: string) {
  const digits = value.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? `234${digits.slice(1)}` : digits}`;
}
export function directionsHref(location: { address: string; city: string; state: string }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.address}, ${location.city}, ${location.state}, Nigeria`)}`;
}
export function filterStockists(locations: PublicStockist[], state: string, city: string, product: string, search: string) {
 const query = search.trim().toLocaleLowerCase();
 return locations.filter(shop => shop.isActive && (!state || shop.state === state) && (!city || shop.city === city) && (!product || shop.productSlugs.includes(product)) && (!query || `${shop.name} ${shop.address} ${shop.city} ${shop.state}`.toLocaleLowerCase().includes(query)));
}
