import { Skipper } from '../model/skipper';
import { SkipperDao, SkipperModel } from '../database/skipper.dao';
export class SkipperService {
  private skipperDao: SkipperDao = new SkipperDao();
  /**
   * returns all Skippers in the database
   */
  public async returnAllSkippers(): Promise<Array<Skipper>> {
    return (await this.skipperDao.getSkippers()).map((skipper: SkipperModel) =>
      Skipper.fromModel(skipper)
    );
  }
  /**
   * updates the leave boolean of a skipper found by id to new value
   * @param idOfSkipper id of skipper to be updated
   * @param updatedValue updated value of leave boolean
   */
  public async updateLeaveOfSkipper(
    idOfSkipper: number,
    updatedValue: boolean
  ): Promise<void> {
    return this.skipperDao.updateLeaveValueInSkipper(idOfSkipper, updatedValue);
  }

  /**
   * delete skipper from database found by id
   * @param idOfSkipper id of skipper to be deleted
   */
  public async deleteSkipper(idOfSkipper: number): Promise<void> {
    return this.skipperDao.deleteSkipper(idOfSkipper);
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
    birthDate: Date,
    leave: boolean
  ): Promise<void> {
    return this.skipperDao.saveNewSkipper({
      name,
      pricePerDay,
      birthDate,
      leave,
    });
  }
}
