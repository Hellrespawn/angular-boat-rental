import { ServerError } from '../util/error';
import { SkipperModel } from '../database/skipper.dao';

export class Skipper {
  public pricePerDay: number;

  public birthDate: Date;

  constructor(
    public name: string,
    pricePerDay: number,
    birthDate: Date,
    public leave: boolean,
    public id?: number
  ) {
    if (this.isHigherThenZero(pricePerDay)) {
      this.pricePerDay = pricePerDay;
    } else {
      throw new ServerError('invalid price per day');
    }

    if (this.dateIsInPast(birthDate)) {
      this.birthDate = birthDate;
    } else {
      throw new ServerError('invalid date of birth');
    }
  }

  public static fromModel(skipperModel: SkipperModel): Skipper {
    return new Skipper(
      skipperModel.name,
      skipperModel.pricePerDay,
      skipperModel.birthDate,
      skipperModel.leave,
      skipperModel.id
    );
  }

  private isHigherThenZero(value: number): boolean {
    return value > 0;
  }

  private dateIsInPast(inputDate: Date): boolean {
    const currentDate = new Date();
    return inputDate < currentDate;
  }
}
