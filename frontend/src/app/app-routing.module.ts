import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AddBoatComponent } from './add-boat/add-boat.component';
import { AddSkipperComponent } from './add-skipper/add-skipper.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './log-in/log-in.component';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'add-boat', component: AddBoatComponent },
  { path: 'add-skipper', component: AddSkipperComponent },
  { path: 'registratie-pagina', component: RegistrationComponent },
  { path: 'log-In', component: LoginComponent },
  { path: 'veel-gestelde-vragen', component: FaqComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
