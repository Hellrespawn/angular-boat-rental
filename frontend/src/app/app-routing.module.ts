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
import { AdminBoatAddComponent } from './admin/boats/add/add.component';
import { AdminBoatOverviewComponent } from './admin/boats/overview/overview.component';
import { AdminUserOverviewComponent } from './admin/users/overview/overview.component';

const routes: Routes = [
  { path: 'home', title: 'Home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'user',
    component: UserComponent,
    title: 'User Dashboard',
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'orders', component: UserRentalsComponent },
      { path: 'settings', component: UserSettingsComponent },
    ],
  },

  {
    path: 'admin/boats/add',
    title: 'Add Boat',
    component: AdminBoatAddComponent,
  },
  {
    path: 'admin/boats/overview',
    title: 'Boats',
    component: AdminBoatOverviewComponent,
  },
  {
    path: 'admin/users/overview',
    title: 'Boats',
    component: AdminUserOverviewComponent,
  },

  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: 'login', title: 'Log In', component: LoginComponent },
  {
    path: 'rent',
    title: 'Rent a Boat',
    component: BookingComponent,
    children: [],
  },
  {
    path: 'rent/check/:boatId',
    title: 'Check your order',
    component: CheckComponent,
  },
  {
    path: 'rent/payment/:rentalId',
    title: 'Payment',
    component: PaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
