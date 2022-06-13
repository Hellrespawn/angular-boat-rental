import { Skipper } from '../model/skipper';
import { SkipperDao } from '../database/skipper.dao';
import { ServerError } from '../util/error';
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
  public async updateLeaveOfSkipper(
    idOfSkipper: number,
    updatedValue: boolean
  ): Promise<void> {
    if (typeof idOfSkipper !== 'number' || idOfSkipper < 1) {
      throw new ServerError('invalid id');
    } else if (typeof updatedValue !== 'boolean') {
      throw new ServerError('invalid new value of leave');
    }
    return this.skipperDao.updateLeaveValueInSkipper(idOfSkipper, updatedValue);
  }

  /**
   * delete skipper from database found by id
   * @param idOfSkipper id of skipper to be deleted
   */
  public async deleteSkipper(idOfSkipper: number): Promise<void> {
    if (typeof idOfSkipper !== 'number' || idOfSkipper < 1) {
      throw new ServerError('invalid id');
    }
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
    const newSkipper: Skipper = new Skipper(
      name,
      pricePerDay,
      birthDate,
      leave
    );
    return this.skipperDao.saveNewSkipper(newSkipper);
  }
}
