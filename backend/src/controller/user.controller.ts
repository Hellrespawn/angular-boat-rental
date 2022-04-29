import { UserService } from '../services/user.service';
import { User } from '../model/user.model';
import express from 'express';

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
}
