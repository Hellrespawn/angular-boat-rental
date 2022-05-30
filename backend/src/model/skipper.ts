import { SkipperModel } from '../database/skipper.dao';

export class Skipper {
  constructor(
    public name: string,
    public pricePerDay: number,
    public birthDate: Date,
    public leave: boolean,
    public id?: number
  ) {}

  public static fromModel(skipperModel: SkipperModel): Skipper {
    return new Skipper(
      skipperModel.name,
      skipperModel.pricePerDay,
      skipperModel.birthDate,
      skipperModel.leave,
      skipperModel.id
    );
  }
}
