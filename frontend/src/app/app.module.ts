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
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AddBoatComponent } from './add-boat/add-boat.component';
import { AddSkipperComponent } from './add-skipper/add-skipper.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './log-in/log-in.component';
import { FaqComponent } from './faq/faq.component';

import { RentalComponent } from './booking/booking.component';
import { LicenseComponent } from './booking/filters/license/license.component';
import { BoatTypeComponent } from './booking/filters/boat-type/boat-type.component';
import { BoatCardComponent } from './booking/boat-card/boat-card.component';
import { MatCardModule } from '@angular/material/card';

// Home components
import { HomeComponent } from './home/home.component';
import { HomeFeatureComponent } from './home/feature/feature.component';
import { FeatureBadgeComponent } from './home/feature/badge/badge.component';
import { ShortcutsComponent } from './home/shortcuts/shortcuts.component';

// Header components
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { AdminBoatOverviewComponent } from './admin-boat-overview/admin-boat-overview.component';
import { AdminSkipperOverviewComponent } from './admin-skipper-overview/admin-skipper-overview.component';
import { BoatDetailsComponent } from './booking/boat-card/boat-details/boat-details.component';
import { DateComponent } from './booking/filters/date/date.component';
import { CheckComponent } from './booking/check/check.component';
import { AdminUserOverviewComponent } from './admin-user-overview/admin-user-overview.component';
import { SuccessDialogComponent } from './booking/payment/success-dialog/success-dialog.component';
import { SelectSkipperComponent } from './booking/skipper/select-skipper.component';
import { PaymentComponent } from './booking/payment/payment.component';
import { FiltersComponent } from './booking/filters/filters.component';
import { UserDashboardComponent } from './user/dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserRentalsComponent } from './user/rentals/rentals.component';
import { UserSettingsComponent } from './user/settings/settings.component';

import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    AdminPanelComponent,
    AddBoatComponent,
    AddSkipperComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    ShortcutsComponent,
    HomeComponent,
    HomeFeatureComponent,
    HeaderComponent,
    RegistrationComponent,
    LoginComponent,
    FaqComponent,
    FeatureBadgeComponent,
    RegistrationComponent,
    LoginComponent,
    RentalComponent,
    LicenseComponent,
    BoatTypeComponent,
    BoatCardComponent,
    AdminBoatOverviewComponent,
    AdminSkipperOverviewComponent,
    BoatDetailsComponent,
    DateComponent,
    CheckComponent,
    AdminUserOverviewComponent,
    SuccessDialogComponent,
    SelectSkipperComponent,
    PaymentComponent,
    FiltersComponent,
    UserDashboardComponent,
    UserComponent,
    UserRentalsComponent,
    UserSettingsComponent,
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
    MatSnackBarModule,
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
  ],
  providers: [
    MatSnackBarModule,
    { provide: MAT_DATE_LOCALE, useValue: 'nl-NL' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
