import { Emirate } from '../types';

export interface SpotLogisticsCalculation {
  pickupLocation: string;
  pickupZone: string;
  pickupEmirate: Emirate;
  supplierShopName: string;
  destinationLocation: string;
  destinationEmirate: Emirate;
  estimatedDistanceKm: number;
  estimatedTransitMinutes: number;
  transitTimeEstimate: string;
  vehicleType: string;
  vehicleCapacity: string;
  craneRequired: boolean;
  baseFareAED: number;
  distanceFareAED: number;
  tollAndPermitsAED: number;
  craneSurchargeAED: number;
  spotDeliveryFeeAED: number;
  routeDescription: string;
  insuranceIncluded: boolean;
}

interface CalculateSpotLogisticsParams {
  supplierShopName: string;
  supplierZone?: string;
  supplierEmirate?: Emirate;
  supplierAddress?: string;
  deliveryAddress: string;
  deliveryEmirate: Emirate;
  offloadingRequired?: boolean;
  totalItemsCount?: number;
  category?: string;
}

export function calculateSpotLogistics({
  supplierShopName,
  supplierZone = 'Al Quoz Industrial Area 3',
  supplierEmirate = 'Dubai',
  supplierAddress = 'Industrial Warehouse',
  deliveryAddress,
  deliveryEmirate,
  offloadingRequired = false,
  totalItemsCount = 1,
  category = '',
}: CalculateSpotLogisticsParams): SpotLogisticsCalculation {
  const normOriginZone = (supplierZone || '').toLowerCase();
  const normOriginEmirate = (supplierEmirate || 'Dubai').toLowerCase();
  const normDestAddress = (deliveryAddress || '').toLowerCase();
  const normDestEmirate = (deliveryEmirate || 'Dubai').toLowerCase();

  const isCrossEmirate = normOriginEmirate !== normDestEmirate;

  // 1. Calculate Estimated Route Distance (KM) in UAE
  let distanceKm = 22; // default benchmark distance

  if (normOriginEmirate === 'dubai' && normDestEmirate === 'dubai') {
    if (normDestAddress.includes('business bay') || normDestAddress.includes('downtown') || normDestAddress.includes('sheikh zayed')) {
      distanceKm = normOriginZone.includes('al quoz') ? 14 : 24;
    } else if (normDestAddress.includes('jebel ali') || normDestAddress.includes('jafza') || normDestAddress.includes('dubai south') || normDestAddress.includes('expo')) {
      distanceKm = normOriginZone.includes('al quoz') ? 34 : 45;
    } else if (normDestAddress.includes('deira') || normDestAddress.includes('bur dubai') || normDestAddress.includes('ras al khor')) {
      distanceKm = normOriginZone.includes('al quoz') ? 22 : 16;
    } else if (normDestAddress.includes('marina') || normDestAddress.includes('jbr') || normDestAddress.includes('barsha')) {
      distanceKm = normOriginZone.includes('al quoz') ? 16 : 28;
    } else {
      distanceKm = 20;
    }
  } else if (
    (normOriginEmirate === 'sharjah' && normDestEmirate === 'dubai') ||
    (normOriginEmirate === 'dubai' && normDestEmirate === 'sharjah')
  ) {
    if (normDestAddress.includes('jebel ali') || normDestAddress.includes('dubai south')) {
      distanceKm = 56;
    } else if (normDestAddress.includes('deira') || normDestAddress.includes('al quoz')) {
      distanceKm = 32;
    } else {
      distanceKm = 38;
    }
  } else if (normOriginEmirate === 'ajman' || normDestEmirate === 'ajman') {
    distanceKm = normDestEmirate === 'dubai' || normOriginEmirate === 'dubai' ? 52 : 24;
  } else if (normOriginEmirate === normDestEmirate) {
    distanceKm = 15;
  }

  // Transit time estimate (~1.5 min per km + 20 mins terminal loading/unloading)
  const transitMinutes = Math.round(distanceKm * 1.6 + 25);

  // 2. Determine Required Vehicle Class based on Electrical Material Payload
  let vehicleType = '1.5-Ton Enclosed Pickup';
  let vehicleCapacity = 'Payload up to 1,500 KG • Weatherproof Cargo Enclosure';
  let baseFare = 110;
  let perKmRate = 2.5;

  const isHeavyCategory = 
    category.includes('Cable') || 
    category.includes('Switchgear') || 
    category.includes('Containment') || 
    category.includes('Transformers');

  if (offloadingRequired) {
    vehicleType = '7-Ton Hiab Crane Flatbed Truck';
    vehicleCapacity = '7,000 KG Payload • Certified Hydraulic Boom Offloader';
    baseFare = 260;
    perKmRate = 4.2;
  } else if (isHeavyCategory || totalItemsCount > 3) {
    vehicleType = '3-Ton Open Flatbed Truck';
    vehicleCapacity = '3,000 KG Payload • Extended 14ft Deck for Conduits & Drums';
    baseFare = 160;
    perKmRate = 3.2;
  }

  // 3. Compute Spot Rates
  const distanceFare = Math.round(distanceKm * perKmRate);
  const tollAndPermits = isCrossEmirate ? 40 : 15; // Salik & Inter-Emirate municipal freight permit
  const craneSurcharge = offloadingRequired ? 120 : 0;

  // Raw total
  const rawTotal = baseFare + distanceFare + tollAndPermits + craneSurcharge;
  // Round to clean nearest 10 AED (e.g., 180, 220, 350)
  const spotDeliveryFeeAED = Math.ceil(rawTotal / 10) * 10;

  const routeDescription = `${supplierZone} (${supplierEmirate}) ➔ ${deliveryAddress} (${deliveryEmirate})`;

  const transitTimeEstimate = transitMinutes > 60
    ? `${Math.floor(transitMinutes / 60)}h ${transitMinutes % 60}m`
    : `${transitMinutes} mins`;

  return {
    pickupLocation: `${supplierShopName} (${supplierAddress})`,
    pickupZone: supplierZone,
    pickupEmirate: supplierEmirate,
    supplierShopName,
    destinationLocation: deliveryAddress,
    destinationEmirate: deliveryEmirate,
    estimatedDistanceKm: distanceKm,
    estimatedTransitMinutes: transitMinutes,
    transitTimeEstimate,
    vehicleType,
    vehicleCapacity,
    craneRequired: offloadingRequired,
    baseFareAED: baseFare,
    distanceFareAED: distanceFare,
    tollAndPermitsAED: tollAndPermits,
    craneSurchargeAED: craneSurcharge,
    spotDeliveryFeeAED,
    routeDescription,
    insuranceIncluded: true,
  };
}
