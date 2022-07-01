import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoginComponent } from './login/login.component';

import { BookingComponent } from './booking/booking.component';
import { LicenseFilterComponent } from './booking/filters/license/license.component';
import { BoatTypeFilterComponent } from './booking/filters/boat-type/boat-type.component';
import { BoatCardComponent } from './booking/boat-card/boat-card.component';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './home/home.component';
import { HomeFeatureComponent } from './home/feature/feature.component';
import { FeatureBadgeComponent } from './home/feature/badge/badge.component';
import { ShortcutsComponent } from './home/shortcuts/shortcuts.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { BoatDetailsComponent } from './booking/boat-card/boat-details/boat-details.component';
import { DateComponent } from './booking/filters/date/date.component';
import { CheckComponent } from './booking/check/check.component';
import { SuccessDialogComponent } from './booking/payment/success-dialog/success-dialog.component';
import { PaymentComponent } from './booking/payment/payment.component';
import { FiltersComponent } from './booking/filters/filters.component';
import { UserDashboardComponent } from './user/dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserRentalsComponent } from './user/rentals/rentals.component';
import { UserSettingsComponent } from './user/settings/settings.component';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { RegisterComponent } from './register/register.component';
import { AdminBoatOverviewComponent } from './admin/boats/overview/overview.component';
import { AdminBoatAddComponent } from './admin/boats/add/add.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    ShortcutsComponent,
    HomeComponent,
    HomeFeatureComponent,
    HeaderComponent,
    LoginComponent,
    FeatureBadgeComponent,
    LoginComponent,
    BookingComponent,
    LicenseFilterComponent,
    BoatTypeFilterComponent,
    BoatCardComponent,
    BoatDetailsComponent,
    DateComponent,
    CheckComponent,
    SuccessDialogComponent,
    PaymentComponent,
    FiltersComponent,
    UserDashboardComponent,
    UserComponent,
    UserRentalsComponent,
    UserSettingsComponent,
    RegisterComponent,
    AdminBoatOverviewComponent,
    AdminBoatAddComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatChipsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatDividerModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
