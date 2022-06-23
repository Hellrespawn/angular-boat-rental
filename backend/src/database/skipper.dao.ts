import { Table, Column, Model, Unique, HasMany } from 'sequelize-typescript';
import { RentalModel } from './rental.dao';
import { Skipper } from '../model/skipper';

export class SkipperDao {
  /**
   * gets all SkipperModels from the database and returns them as Skipper instances
   * @returns
   */
  public async getSkippers(): Promise<Skipper[]> {
    return (await SkipperModel.findAll()).map((skipper: SkipperModel) =>
      Skipper.fromModel(skipper)
    );
  }

  /**
   * inserts a new Skipper into the database as an instance of SkipperModel
   * @param newSkipper Skipper instance
   */
  public async saveNewSkipper(newSkipper: Skipper): Promise<void> {
    await SkipperModel.create({
      name: newSkipper.name,
      pricePerDay: newSkipper.pricePerDay,
      birthDate: newSkipper.birthDate,
      leave: newSkipper.leave,
    });
  }

  /**
   * tries to find a SkipperModel from database and return it, if not found throws an error
   * @param idOfSkipper id of the SkipperModel
   * @returns the found SkipperModel
   */
  private async findSkipperOrThrowError(
    idOfSkipper: number
  ): Promise<SkipperModel> {
    const skipper: SkipperModel | null = await SkipperModel.findByPk(
      idOfSkipper
    );
    if (skipper !== null) {
      return skipper;
    } else {
      throw 'Skipper not found';
    }
  }

  /**
   * updates the leave value of a SkipperModel found by id
   * @param idOfSkipper id of the SkipperModel
   * @param updatedValue new value of leave
   */
  public async updateLeaveValueInSkipper(
    idOfSkipper: number,
    updatedValue: boolean
  ): Promise<void> {
    const skipperToUpdate: SkipperModel = await this.findSkipperOrThrowError(
      idOfSkipper
    );
    skipperToUpdate.leave = updatedValue;
    await skipperToUpdate.save();
  }

  /**
   * deletes a SkipperModel from the database found by id
   * @param idOfSkipper if of the SkipperModel
   */
  public async deleteSkipper(idOfSkipper: number): Promise<void> {
    const skipperToDelete: SkipperModel = await this.findSkipperOrThrowError(
      idOfSkipper
    );
    await skipperToDelete.destroy();
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
