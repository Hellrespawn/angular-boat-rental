import { Skipper } from '../model/skipper.model';
export class SkipperService {
  private skipperArray: Skipper[] = [];

  private async updateSkippers(): Promise<void> {
    this.skipperArray = await Skipper.findAll();
  }

  public async returnAllSkippers(): Promise<Array<Skipper>> {
    await this.updateSkippers();
    return this.skipperArray;
  }

  public async updateSkipper(
    idOfSkipper: number,
    updatedValue: boolean
  ): Promise<void> {
    const skipperToUpdate: Skipper | null = await Skipper.findByPk(idOfSkipper);
    if (skipperToUpdate !== null) {
      skipperToUpdate.leave = updatedValue;
      await skipperToUpdate.save();
    } else {
      throw 'Skipper not found';
    }
  }

  public async deleteSkipper(idOfSkipper: number): Promise<void> {
    const skipperToDelete: Skipper | null = await Skipper.findByPk(idOfSkipper);
    if (skipperToDelete !== null) {
      await skipperToDelete.destroy();
    } else {
      throw 'Skipper not found';
    }
  }

  public async addSkipper(
    name: string,
    pricePerDay: number,
    birthDate: Date
  ): Promise<void> {
    await Skipper.create({ name, pricePerDay, birthDate });
  }
}
