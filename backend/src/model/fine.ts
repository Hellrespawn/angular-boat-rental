import { ServerError } from '../util/error';
import { FineModel } from '../database/fine.dao';

export class Fine {
  public userId: number;

  public amount: number;

  constructor(
    userId: number,
    amount: number,
    public paid: boolean,
    public id?: number
  ) {
    if (this.isHigherThenZero(userId)) {
      this.userId = userId;
    } else {
      throw new ServerError('invalid id');
    }
    if (this.isHigherThenZero(amount)) {
      this.amount = amount;
    } else {
      throw new ServerError('invalid amount');
    }
  }

  public static fromModel(fineModel: FineModel): Fine {
    return new Fine(
      fineModel.userId,
      fineModel.amount,
      fineModel.paid,
      fineModel.id
    );
  }

  private isHigherThenZero(value: number): boolean {
    return value > 0;
  }
}
