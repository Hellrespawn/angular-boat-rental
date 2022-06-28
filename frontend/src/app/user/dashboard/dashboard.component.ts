import { Component, OnInit } from '@angular/core';
import { addToNavBar } from 'src/app/navigation.service';
import { formatDate } from '../../date';
import { Rental } from '../../rental';
import { SessionData } from '../../session';
import { SessionService } from '../../session.service';
import { DashboardService } from '../dashboard.service';

@addToNavBar({
  name: 'User Dashboard',
  route: '/user/dashboard',
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
    private dashboardService: DashboardService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.getSessionData();
    this.getNextRental();
  }

  /**
   * Retrieves current session data from SessionService.
   */
  private getSessionData(): void {
    this.sessionService
      .getSessionData()
      .subscribe((sessionData) => (this.sessionData = sessionData));
  }

  /**
   * Gets next rental
   */
  private getNextRental(): void {
    this.dashboardService.getNextRental().subscribe((rental) => {
      if (rental) {
        this.nextRental = rental;
      }
    });
  }

  /**
   * Get user name
   */
  public getName(): string {
    return this.sessionData!.firstName;
  }

  /**
   * Gets formatted date for dateStart
   */
  public formatDateStart(): string {
    return formatDate(this.nextRental!.dateStart);
  }

  /**
   * Gets formatted date for dateStart
   */
  public formatDateEnd(): string {
    return formatDate(this.nextRental!.dateEnd);
  }
}
