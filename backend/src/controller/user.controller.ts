import { UserService } from '../services/user.service';
import express from 'express';
import { RentalService } from '../services/rental.service';
import { ServerError } from '../util/error';
import { User } from '../model/user';
import { UserModel } from '../database/user.dao';

export class UserController {
  constructor(
    private userService: UserService = new UserService(),
    private rentalService = new RentalService()
  ) {}

  /**gets all Users from the database through the service
   * @param res the response sent back to the client
   */
  public async getUsers(res: express.Response): Promise<void> {
    try {
      const result: User[] = await this.userService.returnAllUsers();
      res.status(200).json(result);
    } catch {
      console.error();
      res.status(500).json('Something went wrong!');
    }
  }

  /**
   * deletes a User from the database by id through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async deleteUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfUser: number = +req.params.id;
    try {
      const result = await this.userService.deleteUser(idOfUser);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  /**updates the blocked-boolean in a User in the database by id through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async updateBlockedValueOfUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfUser: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      const result = await this.userService.updateBlockedValueOfUser(
        idOfUser,
        updatedValue
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async checkUserMail(req: express.Request): Promise<UserModel | null> {
    const emailAddress: string = req.body.emailAddress;
    const result = await this.userService.checkEmail(emailAddress);

    return result;
  }

  // send users to Database
  public async sendUserToDB(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (!(await this.checkUserMail(req))) {
      const firstName: string = req.body.firstName;
      const lastName: string = req.body.lastName;
      const license: boolean = req.body.license;
      const emailAddress: string = req.body.emailAddress;
      const password: string = req.body.password;
      try {
        await this.userService.createNewUser(
          firstName,
          lastName,
          license,
          emailAddress,
          password,
          false
        );
        res.status(200).end();
      } catch (error) {
        console.error();
        res.status(400).json(error);
        console.log(error);
      }
    } else {
      res.status(400).end();
    }
  }

  /**
   * Returns the next rental for the authenticated user.
   *
   * @param req
   * @param res
   */
  public async getNextRentalForUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    // Ensured by middleware in route
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id: number = req.currentUser!.id;

    try {
      const rental = await this.rentalService.getNextRentalByUserId(id);
      res.json({ rental });
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}
