import { Skipper } from '../model/skipper.model';
export class SkipperService {
  /**
   * returns all Skippers in the database
   */
  public async returnAllSkippers(): Promise<Array<Skipper>> {
    return await Skipper.findAll();
  }
  /**
   * updates the leave boolean of a skipper found by id to new value
   * @param idOfSkipper id of skipper to be updated
   * @param updatedValue updated value of leave boolean
   */
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

  /**
   * delete skipper from database found by id
   * @param idOfSkipper id of skipper to be deleted
   */
  public async deleteSkipper(idOfSkipper: number): Promise<void> {
    const skipperToDelete: Skipper | null = await Skipper.findByPk(idOfSkipper);
    if (skipperToDelete !== null) {
      await skipperToDelete.destroy();
    } else {
      throw 'Skipper not found';
    }
  }

  /**
   * adds a skipper to the database
   * @param name name of new skipper
   * @param pricePerDay price of skipper per day
   * @param birthDate birthdate of new skipper
   */
  public async addSkipper(
    name: string,
    pricePerDay: number,
    birthDate: Date
  ): Promise<void> {
    await Skipper.create({ name, pricePerDay, birthDate });
  }
}
