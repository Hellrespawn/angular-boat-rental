import { Component, OnInit } from '@angular/core';
import { addToNavBar } from 'src/app/navigation.service';
import { formatDate } from '../../date';
import { Rental } from '../../rental';
import { RentalService } from '../../rental.service';
import { CurrentUserData, decodeToken, Token } from '../../session';
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
  private token!: Token | null;
  public nextRental?: Rental;

  constructor(
    private rentalService: RentalService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.observeToken();
    this.getNextRental();
  }

  private observeToken(): void {
    this.sessionService.getToken().subscribe((token) => (this.token = token));
  }

  private getNextRental(): void {
    this.rentalService.getNextRental(this.token!).subscribe((rental) => {
      if (rental) {
        this.nextRental = rental;
      }
    });
  }

  public getCurrentUserData(): CurrentUserData | null {
    if (this.token) {
      return decodeToken(this.token);
    }

    return null;
  }

  public getName(): string {
    return this.getCurrentUserData()!.firstName;
  }

  public formatDateStart(): string {
    return formatDate(this.nextRental!.dateStart);
  }

  public formatDateEnd(): string {
    return formatDate(this.nextRental!.dateEnd);
  }
}
