import { Boat } from '../model/boat.model';

export interface BoatOverviewData {
  imageRoute: string;
  name: string;
  requirements: 'none' | 'license' | 'skipper';
  boatType: 'motor' | 'sail';
  maxOccupants: number;
}

export class BoatService {
  private boatArray: Array<Boat> = [];

  private async updateBoats(): Promise<void> {
    this.boatArray = await Boat.findAll();
  }

  public async returnAllBoats(): Promise<Array<Boat>> {
    await this.updateBoats();
    return this.boatArray;
  }

  public async getBoatOverviewData(): Promise<BoatOverviewData[]> {
    const boats = await this.returnAllBoats();

    return boats.map((boat) => {
      return {
        name: boat.name,
        imageRoute: boat.imageRoute,
        requirements: boat.getRequirements(),
        boatType: boat.boatType,
        maxOccupants: boat.maxOccupants,
      } as BoatOverviewData;
      // Explicit cast for string to string union.
    });
  }
}
