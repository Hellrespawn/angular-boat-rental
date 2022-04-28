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

export type BoatOverviewData = {
  id: number;
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: BoatType;
  maxOccupants: number;
};

export type BoatDetailData = BoatOverviewData & {
  registrationNumber: number;
  pricePerDay: number;
  lengthInM: number;
  maxSpeedInKmH?: number;
  sailAreaInM2?: number;
};
