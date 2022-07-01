/**
 * Interface matching the expected data for a new rental. User id determined
 * from cookie.
 */
export interface NewRentalData {
  boatRegistrationNumber: number;
  dateStart: string;
  dateEnd: string;
}

export interface RentalConfirmation {
  orderNumber: number;
}
