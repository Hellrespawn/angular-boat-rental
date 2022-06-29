// import { UserService } from '../services/user.service';
import { RentalService } from '../services/rental.service';
import { ServerError } from '../util/error';
import { type Request, type Response } from 'express';
import { JSONSchemaType } from 'ajv';
import { UserService } from '../services/user.service';

export interface NewUserData {
  firstName: string;
  lastName: string;
  license: boolean;
  emailAddress: string;
  password: string;
}

export const NEW_USER_SCHEMA: JSONSchemaType<NewUserData> = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    license: {
      type: 'boolean',
    },
    emailAddress: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
  },
  required: ['firstName', 'lastName', 'license', 'emailAddress', 'password'],
  additionalProperties: false,
};

export class UserController {
  private static instance?: UserController;

  private constructor(
    private userService = UserService.getInstance(),
    private rentalService = RentalService.getInstance()
  ) {}

  public static getInstance(): UserController {
    if (!this.instance) {
      this.instance = new UserController();
    }

    return this.instance;
  }

  // send users to Database
  public async register(req: Request, res: Response): Promise<void> {
    // Validated by middleware
    const { firstName, lastName, license, emailAddress, password } =
      req.body as NewUserData;

    try {
      await this.userService.register(
        firstName,
        lastName,
        license,
        emailAddress,
        password
      );

      res.status(200).end();
    } catch (error) {
      ServerError.respond(error, res);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);

    try {
      await this.userService.delete(id);
    } catch (error) {
      ServerError.respond(error, res);
    }
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
