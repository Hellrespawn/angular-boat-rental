import { FineModel } from '../database/fine.dao';

export class Fine {
  constructor(
    public userId: number,
    public amount: number,
    public paid: boolean,
    public id?: number
  ) {}

  public static fromModel(fineModel: FineModel): Fine {
    return new Fine(
      fineModel.userId,
      fineModel.amount,
      fineModel.paid,
      fineModel.id
    );
  }
}
