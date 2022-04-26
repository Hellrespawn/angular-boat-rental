export type BoatType = 'motor' | 'sail';

export type BoatRequirements = 'none' | 'license' | 'skipper';

export type Boat = {
  id: number;
  name: string;
  registrationNumber: number;
  pricePerDay: number;
  skipperRequired: boolean;
  maintenance: boolean;
  imageRoute: string;
  lengthInM: number;
  maxOccupants: number;
  boatType: BoatType;
  maxSpeedInKmH?: number;
  sailAreaInM2?: number;
};

/**
 * Creates a string to display from BoatRequirements
 * @returns
 */
export function requirementsToString<
  T extends { requirements: BoatRequirements }
>(item: T): string {
  switch (item.requirements) {
    case 'none':
      return 'Zelf varen';

    case 'license':
      return 'Vaarbewijs vereist';

    case 'skipper':
      return 'Schipper vereist';

    default:
      throw `Invalid boat.requirements: ${item.requirements}`;
  }
}
