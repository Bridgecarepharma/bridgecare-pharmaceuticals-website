export type ShippingZoneView = {
  code: string;
  name: string;
  priceKobo: number;
  states: string[];
  isActive: boolean;
  sortOrder: number;
};

export const DEFAULT_FREE_SHIPPING_PACK_COUNT = 3;

export const DEFAULT_SHIPPING_ZONES: ShippingZoneView[] = [
  { code: "LAGOS", name: "Lagos", priceKobo: 350000, states: ["Lagos"], isActive: true, sortOrder: 1 },
  { code: "SOUTH_WEST", name: "South West", priceKobo: 400000, states: ["Ekiti", "Ogun", "Ondo", "Osun", "Oyo"], isActive: true, sortOrder: 2 },
  { code: "SOUTH_EAST", name: "South East", priceKobo: 550000, states: ["Abia", "Akwa Ibom", "Anambra", "Bayelsa", "Cross River", "Delta", "Ebonyi", "Edo", "Enugu", "Imo", "Rivers"], isActive: true, sortOrder: 3 },
  { code: "NORTHERN_STATE", name: "Northern State", priceKobo: 700000, states: ["Abuja", "Adamawa", "Bauchi", "Benue", "Borno", "Gombe", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "Sokoto", "Taraba", "Yobe", "Zamfara"], isActive: true, sortOrder: 4 },
];

export function zoneForState(state: string, zones: ShippingZoneView[] = DEFAULT_SHIPPING_ZONES) {
  return zones.find((zone) => zone.isActive && zone.states.includes(state));
}

export function calculateShippingKobo(
  state: string,
  packCount: number,
  zones: ShippingZoneView[] = DEFAULT_SHIPPING_ZONES,
  freeShippingPackCount = DEFAULT_FREE_SHIPPING_PACK_COUNT,
) {
  if (freeShippingPackCount > 0 && packCount >= freeShippingPackCount) return 0;
  return zoneForState(state, zones)?.priceKobo ?? 0;
}
