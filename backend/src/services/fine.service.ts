import { Fine } from '../model/fine.model';

export class FineService {
  /**
   * returns all Fines in the database
   */
  public async returnAllFines(): Promise<Array<Fine>> {
    return await Fine.findAll();
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
    await Fine.create({ userID, amount, paid });
  }
}
