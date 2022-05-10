import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AddBoatComponent } from './add-boat/add-boat.component';
import { AddSkipperComponent } from './add-skipper/add-skipper.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FaqComponent } from './faq/faq.component';
import { RentalComponent } from './booking/booking.component';
import { AdminBoatOverviewComponent } from './admin-boat-overview/admin-boat-overview.component';
import { AdminSkipperOverviewComponent } from './admin-skipper-overview/admin-skipper-overview.component';
import { CheckComponent } from './booking/check/check.component';
import { AdminUserOverviewComponent } from './admin-user-overview/admin-user-overview.component';
import { SelectSkipperComponent } from './booking/skipper/select-skipper.component';
import { PaymentComponent } from './booking/payment/payment.component';
import { UserDashboardComponent } from './user/dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserRentalsComponent } from './user/rentals/rentals.component';
import { UserSettingsComponent } from './user/settings/settings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'add-boat', component: AddBoatComponent },
  { path: 'add-skipper', component: AddSkipperComponent },
  {
    path: 'gebruiker',
    component: UserComponent,
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'boekingen', component: UserRentalsComponent },
      { path: 'gegevens', component: UserSettingsComponent },
    ],
  },
  { path: 'registratie-pagina', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'veel-gestelde-vragen', component: FaqComponent },
  { path: 'verhuur', component: RentalComponent },
  { path: 'verhuur/controleer/:boatId', component: CheckComponent },
  { path: 'verhuur/schipper/:rentalId', component: SelectSkipperComponent },
  { path: 'verhuur/betalen/:rentalId', component: PaymentComponent },
  { path: 'boat-overview-admin', component: AdminBoatOverviewComponent },
  { path: 'skipper-overview-admin', component: AdminSkipperOverviewComponent },
  {
    path: 'user-overview-admin',
    component: AdminUserOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
