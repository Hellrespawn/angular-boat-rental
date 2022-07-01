export const BOAT_TYPES = ['sail', 'motor'];

export type BoatType = typeof BOAT_TYPES[number];

export type BoatRequirements = 'none' | 'license';

/**
 * Interface matching the expected data for a new boat.
 */
 export interface NewBoatData {
  registrationNumber: number;
  pricePerDay: number;
  imageRoute: string;
  lengthInM: number;
  maxPassengers: number;
  boatType: BoatType;
  sailAreaInM2?: number;
  maxSpeedInKmH?: number;
  name?: string;
}

/**
 * type which is required by the boat rental overview page
 */
 export interface BoatOverviewData {
    registrationNumber: number;
    imageRoute: string;
    requirements: BoatRequirements;
    boatType: BoatType;
    maxPassengers: number;
    name?: string;
  }
  /**
   * type which contains additional information about the boat
   */
  export type BoatDetailData = BoatOverviewData & {
    pricePerDay: number;
    lengthInM: number;
    maxSpeedInKmH?: number;
    sailAreaInM2?: number;
  };
