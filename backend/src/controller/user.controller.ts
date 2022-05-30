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

  // get usercount from DB, if count > 1 User role = guest else role = admin
  public getUserCountfromDB(): Promise<number> {
    const usercount = UserModel.count();
    return usercount;
  }

  // send users to Database
  public async sendUserToDB(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (!(await this.checkUserMail(req, res))) {
      const isAdmin = (await this.getUserCountfromDB()) ? false : true;
      const firstName: string = req.body.firstName;
      const lastName: string = req.body.lastName;
      // const dateOfBirth: Date = req.body.dateOfBirth;
      const emailAddress: string = req.body.emailAddress;
      const password: string = req.body.password;

      try {
        const result = await UserModel.create({
          firstName,
          lastName,
          emailAddress,
          password,
          license: false,
          blocked: false,
          admin: isAdmin,
        });
        res.status(200).json(result);
      } catch (error) {
        console.error();
        res.status(400).json(error);
      }
    } else {
      return;
    }
  }

  public async checkUserMail(
    req: express.Request,
    res: express.Response
  ): Promise<UserModel | null> {
    const emailAddress: string = req.body.emailAddress;
    const result = await this.userService.checkEmail(emailAddress);
    return result;
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

    console.log(req.currentUser);
    const id: number = req.currentUser!.id;

    try {
      const rental = await this.rentalService.getNextRentalByUserId(id);
      res.json({ rental });
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}
