import { Boat } from '../model/boat.model';

export type BoatOverviewData = {
  id: number;
  imageRoute: string;
  name: string;
  requirements: 'none' | 'license' | 'skipper';
  boatType: 'motor' | 'sail';
  maxOccupants: number;
};

export type BoatDetailData = {
  registrationNumber: number;
  pricePerDay: number;
  lengthInM: number;
  maxSpeedInKmH?: number;
  sailAreaInM2?: number;
};

export class BoatService {
  private boatArray: Array<Boat> = [];

  private async updateBoats(): Promise<void> {
    this.boatArray = await Boat.findAll();
  }

  public async returnAllBoats(): Promise<Array<Boat>> {
    await this.updateBoats();
    return this.boatArray;
  }

  public async getBoatDetailData(
    id: number
  ): Promise<(BoatOverviewData & BoatDetailData) | null> {
    const boat = await Boat.findByPk(id);

    if (boat) {
      const overviewData = this.boatInstanceToOverviewData(boat);

      const detailData: BoatDetailData = {
        registrationNumber: boat.registrationNumber,
        pricePerDay: boat.pricePerDay,
        lengthInM: boat.lengthInM,
        // These constraints are enforced at object creation.
        maxSpeedInKmH: boat.maxSpeedInKmH,
        sailAreaInM2: boat.sailAreaInM2,
      };

      return { ...overviewData, ...detailData };
    } else {
      return null;
    }
  }

  private boatInstanceToOverviewData(boat: Boat): BoatOverviewData {
    return {
      id: boat.id,
      name: boat.name,
      imageRoute: boat.imageRoute,
      requirements: boat.getRequirements(),
      boatType: boat.boatType,
      maxOccupants: boat.maxOccupants,
    } as BoatOverviewData;
  }

  public async getBoatOverviewData(): Promise<BoatOverviewData[]> {
    const boats = await this.returnAllBoats();

    return boats.map(this.boatInstanceToOverviewData);
  }
}
