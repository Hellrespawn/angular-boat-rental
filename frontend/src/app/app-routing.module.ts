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
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'orders', component: UserRentalsComponent },
      { path: 'settings', component: UserSettingsComponent },
    ],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rent', component: BookingComponent },
  { path: 'rent/check/:boatId', component: CheckComponent },
  { path: 'rent/payment/:rentalId', component: PaymentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
