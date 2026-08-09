import { prisma } from "@/lib/prisma";
import {
  calculateShippingKobo,
  calculateShippingForZoneKobo,
  DEFAULT_FREE_SHIPPING_PACK_COUNT,
  DEFAULT_SHIPPING_ZONES,
  type ShippingZoneView,
} from "@/lib/shipping-rates";

export { DEFAULT_FREE_SHIPPING_PACK_COUNT, DEFAULT_SHIPPING_ZONES, calculateShippingKobo, calculateShippingForZoneKobo } from "@/lib/shipping-rates";
export type { ShippingZoneView } from "@/lib/shipping-rates";

export async function ensureShippingConfiguration() {
  await prisma.$transaction([
    ...DEFAULT_SHIPPING_ZONES.map((zone) =>
      prisma.shippingZone.upsert({
        where: { code: zone.code },
        update: {},
        create: {
          code: zone.code,
          name: zone.name,
          priceKobo: zone.priceKobo,
          states: zone.states,
          isActive: zone.isActive,
          sortOrder: zone.sortOrder,
        },
      }),
    ),
    prisma.shippingSetting.upsert({
      where: { id: "default" },
      update: { freeShippingPackCount: 3 },
      create: { id: "default", freeShippingPackCount: 3 },
    }),
  ]);
}

export async function getShippingConfiguration() {
  await ensureShippingConfiguration();
  const [zones, setting] = await Promise.all([
    prisma.shippingZone.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.shippingSetting.findUnique({ where: { id: "default" } }),
  ]);
  return {
    zones: zones.map((zone): ShippingZoneView => ({
      code: zone.code,
      name: zone.name,
      priceKobo: zone.priceKobo,
      states: Array.isArray(zone.states) ? zone.states.filter((state): state is string => typeof state === "string") : [],
      isActive: zone.isActive,
      sortOrder: zone.sortOrder,
    })),
    // Bridgecare policy: any order of 3 packs or more ships free nationwide.
    freeShippingPackCount: 3,
  };
}

export async function shippingFeeForDatabaseOrder(state: string, packCount: number) {
  const configuration = await getShippingConfiguration();
  return calculateShippingKobo(state, packCount, configuration.zones, 3);
}

export async function shippingFeeForSelectedZone(zoneCode: string, state: string, packCount: number) {
  const configuration = await getShippingConfiguration();
  return calculateShippingForZoneKobo(
    zoneCode,
    state,
    packCount,
    configuration.zones,
    3,
  );
}
