import { Fine } from '../model/fine';
import { FineDao } from '../database/fine.dao';

export class FineService {
  private fineDao: FineDao = new FineDao();

  /**
   * returns all Fines in the database
   */
  public async returnAllFines(): Promise<Array<Fine>> {
    return this.fineDao.returnAllFines();
  }

  /**
   * adds a new fine to the database
   * @param userId id of the user of the new fine
   * @param amount amount of money
   * @param paid boolean about whether the fine is paid or not
   */
  public async addFine(
    userId: number,
    amount: number,
    paid: boolean
  ): Promise<void> {
    const newFine: Fine = new Fine(userId, amount, paid);
    return this.fineDao.addFine(newFine);
  }
}
