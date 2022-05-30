import { Component, OnInit } from '@angular/core';
import { addToNavBar } from 'src/app/navigation.service';
import { formatDate } from '../../date';
import { Rental } from '../../rental';
import { RentalService } from '../../rental.service';
import { SessionData } from '../../session';
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
  public sessionData!: SessionData | null;
  public nextRental?: Rental;

  constructor(
    private rentalService: RentalService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserType();
    this.getNextRental();
  }

  private getCurrentUserType(): void {
    this.sessionService
      .getSessionData()
      .subscribe((sessionData) => (this.sessionData = sessionData));
  }

  private getNextRental(): void {
    this.rentalService.getNextRental().subscribe((rental) => {
      if (rental) {
        this.nextRental = rental;
      }
    });
  }

  public getName(): string {
    return this.sessionData!.firstName;
  }

  public formatDateStart(): string {
    return formatDate(this.nextRental!.dateStart);
  }

  public formatDateEnd(): string {
    return formatDate(this.nextRental!.dateEnd);
  }
}
