import { Component, OnInit } from '@angular/core';
import { UserOverviewData } from 'auas-common';
import { addToNavBar } from '../../../navigation.service';
import { NotificationService } from '../../../notification.service';
import { UserService } from '../../../user.service';

@addToNavBar({
  name: 'Administer Users',
  route: '/admin/users/overview',
  userTypes: ['admin'],
})
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class AdminUserOverviewComponent implements OnInit {
  public users?: UserOverviewData[];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService
      .getOverviewData()
      .subscribe((users) => (this.users = users));
  }

  public delete(user: UserOverviewData): void {
    this.userService.delete(user.id).subscribe(() => {
      this.users!.splice(this.users!.indexOf(user), 1);
      this.notificationService.notifySuccess(
        `Deleted user ${user.id}: ${user.emailAddress}`
      );
    });
  }

  public toggleBlock(user: UserOverviewData): void {
    this.userService.toggleBlocked(user.id).subscribe((wasBlocked) => {
      this.users![this.users!.indexOf(user)].blocked = wasBlocked;

      this.notificationService.notifySuccess(
        `${wasBlocked ? 'Blocked' : 'Unblocked'} ${user.id}: ${
          user.emailAddress
        }`
      );
    });
  }
}
