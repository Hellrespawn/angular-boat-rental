export interface Boat {
  name: string;
  pricePerDay: number;
  skipperRequired: boolean;
  maintenance: boolean;
  photo?: Buffer;
  lengthInM: number;
  maxOccupants: number;
  boatType: string;
  maxSpeedInKmH: number;
  sailAreaInM2: number;
}

export enum BoatFeature {
  // TODO voeg hier meer aan toe.
  Catering,
  DivingEquipment,
}

export enum BoatRequirements {
  None,
  License,
  Skipper,
}

interface MotorboatRequirementsData {
  skipperRequired: boolean;
  maxOccupants: number;
  maxSpeedInKmH: number;
}

interface SailboatRequirementsData {
  skipperRequired: boolean;
  maxOccupants: number;
  sailAreaInM2: number;
}

function isSailboatRequirements(data: any): data is SailboatRequirementsData {
  return data.sailAreaInM2 && typeof data.sailAreaInM2 === 'number';
}

export function getRequirements(
  data: MotorboatRequirementsData
): BoatRequirements;
export function getRequirements(
  data: SailboatRequirementsData
): BoatRequirements;
export function getRequirements(
  data: MotorboatRequirementsData | SailboatRequirementsData
): BoatRequirements {
  let requirements = BoatRequirements.None;

  if (data.skipperRequired) {
    requirements = BoatRequirements.Skipper;
  } else if (data.maxOccupants > 12) {
    requirements = BoatRequirements.License;
  } else {
    if (isSailboatRequirements(data)) {
      if (data.sailAreaInM2 > 150) {
        requirements = BoatRequirements.License;
      }
    } else {
      if (data.maxSpeedInKmH > 20) {
        requirements = BoatRequirements.License;
      }
    }
  }
  return requirements;
}

// TODO Functie en interface voor license
