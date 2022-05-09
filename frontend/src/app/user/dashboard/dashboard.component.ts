import { Component, OnInit } from '@angular/core';
import { addToNavBar } from 'src/app/navigation.service';
import { Rental } from '../../rental';
import { RentalService } from '../../rental.service';

@addToNavBar({
  name: 'Klantenpaneel',
  route: '/gebruiker',
  userTypes: ['user', 'admin'],
})
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  public nextRental?: Rental;

  constructor(private rentalService: RentalService) {}

  ngOnInit(): void {
    this.getNextRental();
  }

  private getNextRental(): void {
    let id = this.getCurrentUserId();

    this.rentalService.getNextRental(id).subscribe((rental) => {
      if (rental) {
        this.nextRental = rental;
      }
    });
  }

  private getCurrentUserId(): number {
    // FIXME Echte implementatie
    return 1;
  }
}
