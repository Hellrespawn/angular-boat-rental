export type BoatType = 'motor' | 'sail';

export type BoatRequirements = 'none' | 'license' | 'skipper';

export type Boat = {
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
