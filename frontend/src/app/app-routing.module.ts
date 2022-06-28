import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BookingComponent } from './booking/booking.component';
import { CheckComponent } from './booking/check/check.component';
import { PaymentComponent } from './booking/payment/payment.component';
import { UserDashboardComponent } from './user/dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserRentalsComponent } from './user/rentals/rentals.component';
import { UserSettingsComponent } from './user/settings/settings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'gebruiker',
    component: UserComponent,
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'boekingen', component: UserRentalsComponent },
      { path: 'gegevens', component: UserSettingsComponent },
    ],
  },
  // { path: 'registreer', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verhuur', component: BookingComponent },
  { path: 'verhuur/controleer/:boatId', component: CheckComponent },
  { path: 'verhuur/betalen/:rentalId', component: PaymentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
