// import { UserService } from '../services/user.service';
import { RentalService } from '../services/rental.service';
import { ServerError } from '../util/error';
import { type Request, type Response } from 'express';

// TODO Add schema for user here

export class UserController {
  private static instance?: UserController;

  private constructor(
    // private userService = UserService.getInstance(),
    private rentalService = RentalService.getInstance()
  ) {}

  public static getInstance(): UserController {
    if (!this.instance) {
      this.instance = new UserController();
    }

    return this.instance;
  }

  public async delete(req: Request, res: Response): Promise<void> {
    throw new Error('Not yet implemented: UserController.delete');
  }

  // send users to Database
  public async save(req: Request, res: Response): Promise<void> {
    throw new Error('Not yet implemented: UserController.save');
  }

  /**
   * Returns the next rental for the authenticated user.
   *
   * @param req
   * @param res
   */
  public async getNextRental(req: Request, res: Response): Promise<void> {
    // Ensured by middleware in route
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { id } = req.currentUser!;

    try {
      const rental = await this.rentalService.getNextRentalByUserId(id);
      res.json({ rental });
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}
