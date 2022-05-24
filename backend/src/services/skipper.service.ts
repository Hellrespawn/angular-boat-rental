import { Skipper } from '../model/skipper';
import { SkipperDao } from '../database/skipper.dao';
export class SkipperService {
  private skipperDao: SkipperDao = new SkipperDao();
  /**
   * returns all Skippers in the database
   */
  public async returnAllSkippers(): Promise<Array<Skipper>> {
    return this.skipperDao.getSkippers();
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
    await this.skipperDao.updateLeaveValueInSkipper(idOfSkipper, updatedValue);
  }

  /**
   * delete skipper from database found by id
   * @param idOfSkipper id of skipper to be deleted
   */
  public async deleteSkipper(idOfSkipper: number): Promise<void> {
    this.skipperDao.deleteSkipper(idOfSkipper);
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
    this.skipperDao.saveNewSkipper({ name, pricePerDay, birthDate });
  }
}
