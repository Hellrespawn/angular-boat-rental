import { FineModel } from '../database/fine.dao';

export class FineService {
  /**
   * returns all Fines in the database
   */
  public async returnAllFines(): Promise<Array<FineModel>> {
    return await FineModel.findAll();
  }

  /**
   * adds a new fine to the database
   * @param userID id of the user of the new fine
   * @param amount amount of money
   * @param paid boolean about whether the fine is paid or not
   */
  public async addFine(
    userID: number,
    amount: number,
    paid: boolean
  ): Promise<void> {
    await FineModel.create({ userID, amount, paid });
  }
}
