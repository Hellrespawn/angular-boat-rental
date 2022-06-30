import { type Boat } from '../model/boat';
import { BoatModel } from './boat.model';
import { RentalModel } from './rental.model';

export class BoatDao {
  private static instance?: BoatDao;

  private constructor() {
    // Intentionally left blank
  }

  public static getInstance(): BoatDao {
    if (!this.instance) {
      this.instance = new BoatDao();
    }

    return this.instance;
  }

  /**
   * gets all BoatModels from the database and returns them as Boat instances
   * @returns all boatModels
   */
  public async getAll(): Promise<Boat[]> {
    const models = await BoatModel.findAll();

    return models.map((model: BoatModel) => model.toBoat());
  }

  public async getByRegistrationNumber(
    registrationNumber: number
  ): Promise<Boat | null> {
    const boatModel = await BoatModel.findOne({
      where: { registrationNumber },
      include: [RentalModel],
    });

    return boatModel ? boatModel.toBoat() : null;
  }

  /**
   * Returns boat associated with rentalId
   * @param rentalId
   * @returns Boat or null
   */
  public async getByRentalId(rentalId: number): Promise<Boat | null> {
    const boatModel = await BoatModel.findOne({
      where: { rentalId },
    });

    return boatModel ? boatModel.toBoat() : null;
  }

  /**
   * takes a Boat and inserts it into the database as a BoatModel
   * @param newBoat instance of Boat
   */
  public async save(newBoat: Boat): Promise<void> {
    await BoatModel.create({
      name: newBoat.name,
      registrationNumber: newBoat.registrationNumber,
      pricePerDay: newBoat.pricePerDay,
      imageRoute: newBoat.imageRoute,
      lengthInM: newBoat.lengthInM,
      maxOccupants: newBoat.maxOccupants,
      boatType: newBoat.boatType,
      ...newBoat.getBoatData(),
    });
  }

  public delete(id: number): Promise<void> {
    throw new Error('Not yet implemented: BoatDao.delete.');
  }
}
