import { Customer } from '../model/customer.model';
export class CustomerService {
  /**
   * returns all Customers from the database
   */
  public async returnAllCustomers(): Promise<Array<Customer>> {
    return await Customer.findAll();
  }

  /**
   * updates the blocked boolean of a specific Customer found by id
   * @param idOfCustomer id of customer to be updated
   * @param updatedValue new value of the blocked boolean
   */
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

  /**
   * delete a Customer found by id
   * @param idOfCustomer the id of the customer to be deleted
   */
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
