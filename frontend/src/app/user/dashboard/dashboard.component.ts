import { Component, OnInit } from '@angular/core';
import { addToNavBar } from 'src/app/navigation.service';
import { formatDate } from '../../date';
import { Rental } from '../../rental';
import { RentalService } from '../../rental.service';
import { CurrentUserData } from '../../session';
import { SessionService } from '../../session.service';

@addToNavBar({
  name: 'Klantenpaneel',
  route: '/gebruiker/dashboard',
  userTypes: ['user', 'admin'],
})
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  private currentUserData!: CurrentUserData | null;
  public nextRental?: Rental;

  constructor(
    private rentalService: RentalService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserData();
    this.getNextRental();
  }

  private getCurrentUserData(): void {
    this.sessionService
      .getCurrentUserData()
      .subscribe((data) => (this.currentUserData = data));
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
    return this.currentUserData!.sub;
  }

  public getName(): string {
    return this.currentUserData!.firstName;
  }

  public formatDateStart(): string {
    return formatDate(this.nextRental!.dateStart);
  }

  public formatDateEnd(): string {
    return formatDate(this.nextRental!.dateEnd);
  }
}
