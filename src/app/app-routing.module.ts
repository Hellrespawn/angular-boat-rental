import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { BootToevoegComponent } from './boot-toevoeg/boot-toevoeg.component';
import { SchipperToevoegComponent } from './schipper-toevoeg/schipper-toevoeg.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'boot-toevoeg', component: BootToevoegComponent },
  { path: 'schipper-toevoeg', component: SchipperToevoegComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
