import { UserService } from '../services/user.service';
import { User } from '../model/user.model';
import express from 'express';
import e from 'express';

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

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
  public async updateUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfUser: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      const result = await this.userService.updateUser(idOfUser, updatedValue);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public getRoleFromDB() {
    const role = User.count();
    return role;
  }
  // send users to Database
  public async sendUserToDB(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    enum Role {
      Admin,
      Guest,
    }
    if (!(await this.checkUserMail(req, res))) {
      const role = (await this.getRoleFromDB()) ? Role.Guest : Role.Admin;
      const firstName: string = req.body.firstName;
      const lastName: string = req.body.lastName;
      // const dateOfBirth: Date = req.body.dateOfBirth;
      const emailAddress: string = req.body.emailAddress;
      const password: string = req.body.password;
      const license: boolean = req.body.license;

      try {
        const result = await User.create({
          firstName,
          lastName,
          emailAddress,
          password,
          license,
          blocked: false,
          admin: role,
        });
        res.status(200).json(result);
      } catch (error) {
        console.error();
        res.status(400).json(error);
      } 
    } else {
        return
    } 
  }

  public async checkUserMail(req: express.Request, res: express.Response) {
    const emailAddress: string = req.body.emailAddress;
    const result = await this.userService.checkEmail(emailAddress);
    return result;
  }
}
