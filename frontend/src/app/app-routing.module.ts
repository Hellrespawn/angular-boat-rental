import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AddBoatComponent } from './add-boat/add-boat.component';
import { AddSkipperComponent } from './add-skipper/add-skipper.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './log-in/log-in.component';
import { FaqComponent } from './faq/faq.component';
import { RentalComponent } from './rental/rental.component';
import { AdminBoatOverviewComponent } from './admin-boat-overview/admin-boat-overview.component';
import { AdminSkipperOverviewComponent } from './admin-skipper-overview/admin-skipper-overview.component';
import { CheckComponent } from './rental/check/check.component';
import { AdminCustomerOverviewComponent } from './admin-customer-overview/admin-customer-overview.component';
import { SelectSkipperComponent } from './rental/skipper/skipper.component';
import { PaymentComponent } from './rental/payment/payment.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'add-boat', component: AddBoatComponent },
  { path: 'add-skipper', component: AddSkipperComponent },
  { path: 'registratie-pagina', component: RegistrationComponent },
  { path: 'log-In', component: LoginComponent },
  { path: 'veel-gestelde-vragen', component: FaqComponent },
  { path: 'verhuur', component: RentalComponent },
  { path: 'verhuur/controleer/:boatId', component: CheckComponent },
  { path: 'verhuur/schipper/:rentalId', component: SelectSkipperComponent },
  { path: 'verhuur/betalen/:rentalId', component: PaymentComponent },
  { path: 'boat-overview-admin', component: AdminBoatOverviewComponent },
  { path: 'skipper-overview-admin', component: AdminSkipperOverviewComponent },
  {
    path: 'customer-overview-admin',
    component: AdminCustomerOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
