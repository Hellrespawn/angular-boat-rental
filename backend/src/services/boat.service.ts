import { Boat } from '../model/boat.model';
export class BoatService {
  private boatArray: Array<Boat> = [];

  private async updateBoats(): Promise<void> {
    this.boatArray = await Boat.findAll();
  }

  public async returnAllBoats(): Promise<Array<Boat>> {
    await this.updateBoats();
    return this.boatArray;
  }
}
