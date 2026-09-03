export type ShippingZoneView = {
  code: string;
  name: string;
  priceKobo: number;
  states: string[];
  isActive: boolean;
  sortOrder: number;
};

export const DEFAULT_FREE_SHIPPING_PACK_COUNT = 4;

export const DEFAULT_SHIPPING_ZONES: ShippingZoneView[] = [
  { code: "LAGOS_MAINLAND", name: "Lagos Mainland", priceKobo: 350000, states: ["Lagos"], isActive: true, sortOrder: 1 },
  { code: "LAGOS_ISLAND", name: "Lagos Island", priceKobo: 500000, states: ["Lagos"], isActive: true, sortOrder: 2 },
  { code: "SOUTH_WEST", name: "South West Nigeria", priceKobo: 450000, states: ["Ekiti", "Ogun", "Ondo", "Osun", "Oyo"], isActive: true, sortOrder: 3 },
  { code: "SOUTH_SOUTH", name: "South South Nigeria", priceKobo: 500000, states: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"], isActive: true, sortOrder: 4 },
  { code: "SOUTH_EAST", name: "South East Nigeria", priceKobo: 500000, states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"], isActive: true, sortOrder: 5 },
  { code: "NORTHERN_NIGERIA", name: "Northern Nigeria", priceKobo: 550000, states: ["Abuja", "Adamawa", "Bauchi", "Benue", "Borno", "Gombe", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "Sokoto", "Taraba", "Yobe", "Zamfara"], isActive: true, sortOrder: 6 },
];

export function zoneForState(state: string, zones: ShippingZoneView[] = DEFAULT_SHIPPING_ZONES) {
  return zones.find((zone) => zone.isActive && zone.states.includes(state));
}

export function zoneForCode(code: string, zones: ShippingZoneView[] = DEFAULT_SHIPPING_ZONES) {
  return zones.find((zone) => zone.isActive && zone.code === code);
}

export function calculateShippingForZoneKobo(
  zoneCode: string,
  state: string,
  packCount: number,
  zones: ShippingZoneView[] = DEFAULT_SHIPPING_ZONES,
  freeShippingPackCount = DEFAULT_FREE_SHIPPING_PACK_COUNT,
) {
  const zone = zoneForCode(zoneCode, zones);
  if (!zone || !zone.states.includes(state)) return null;
  if (freeShippingPackCount > 0 && packCount >= freeShippingPackCount) return 0;
  return zone.priceKobo;
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
