import { Customer } from '../model/customer.model';
export class CustomerService {
  private customerArray: Array<Customer> = [];

  private async updateCustomers(): Promise<void> {
    this.customerArray = await Customer.findAll();
  }

  public async returnAllCustomers(): Promise<Array<Customer>> {
    await this.updateCustomers();
    return this.customerArray;
  }

  public async updateCustomer(
    idOfCustomer: number,
    updatedValue: boolean
  ): Promise<void> {
    const customerToUpdate: Customer | null = await Customer.findByPk(
      idOfCustomer
    );
    if (customerToUpdate !== null) {
      customerToUpdate.blocked = updatedValue;
      await customerToUpdate.save();
    } else {
      throw 'Customer not found';
    }
  }

  public async deleteCustomer(idOfCustomer: number): Promise<void> {
    const customerToDelete: Customer | null = await Customer.findByPk(
      idOfCustomer
    );
    if (customerToDelete !== null) {
      await customerToDelete.destroy();
    } else {
      throw 'customerToDelete not found';
    }
  }
}
