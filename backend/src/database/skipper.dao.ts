import { Table, Column, Model, Unique, HasMany } from 'sequelize-typescript';
import { RentalModel } from './rental.dao';
import { Skipper } from '../model/skipper';

export class SkipperDao {
  public async getSkippers(): Promise<SkipperModel[]> {
    return SkipperModel.findAll();
  }

  public async saveNewSkipper(newSkipper: Skipper): Promise<void> {
    SkipperModel.create({
      name: newSkipper.name,
      pricePerDay: newSkipper.pricePerDay,
      birthDate: newSkipper.birthDate,
      leave: newSkipper.leave,
    });
  }

  public async updateLeaveValueInSkipper(
    idOfSkipper: number,
    updatedValue: boolean
  ): Promise<void> {
    const skipperToUpdate: SkipperModel | null = await SkipperModel.findByPk(
      idOfSkipper
    );
    if (skipperToUpdate !== null) {
      skipperToUpdate.leave = updatedValue;
      skipperToUpdate.save();
    } else {
      throw 'Skipper not found';
    }
  }

  public async deleteSkipper(idOfSkipper: number): Promise<void> {
    const skipperToDelete: SkipperModel | null = await SkipperModel.findByPk(
      idOfSkipper
    );
    if (skipperToDelete !== null) {
      skipperToDelete.destroy();
    } else {
      throw 'Skipper not found';
    }
  }
}

@Table
export class SkipperModel extends Model {
  @Unique @Column public name!: string;

  @Column public pricePerDay!: number;

  @Column public birthDate!: Date;

  @Column public leave!: boolean;

  @HasMany(() => RentalModel)
  public rentals!: RentalModel[];
}
