import { Directive } from '@angular/core';
import { RentalService } from '../rental.service';

@Directive()
export abstract class BaseFilter<T> {
  constructor(public rentalService: RentalService) {}

  public abstract updateFilter(change: T): void;
}
