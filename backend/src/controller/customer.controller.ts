import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';
import express from 'express';

export class CustomerController {
  constructor(
    private customerService: CustomerService = new CustomerService()
  ) {}

  public async getCustomers(res: express.Response): Promise<void> {
    try {
      const result: Customer[] =
        await this.customerService.returnAllCustomers();
      res.status(200).json(result);
    } catch {
      console.error();
      res.status(500).json('Something went wrong!');
    }
  }

  public async deleteCustomer(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfCustomer: number = +req.params.id;
    try {
      const result = await this.customerService.deleteCustomer(idOfCustomer);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  public async updateCustomer(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfCustomer: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      const result = await this.customerService.updateCustomer(
        idOfCustomer,
        updatedValue
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
