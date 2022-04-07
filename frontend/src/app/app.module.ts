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
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RegistratieComponent } from './registratie/registratie.component';
import { LoginComponent } from './log-in/log-in.component';

// Home components
import { HomeComponent } from './home/home.component';
import { HomeFeatureComponent } from './home/feature/feature.component';
import { FeatureBadgeComponent } from './home/feature/badge/badge.component';
import { ShortcutsComponent } from './home/shortcuts/shortcuts.component';

// Header components
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { AdminBoatOverviewComponent } from './admin-boat-overview/admin-boat-overview.component';

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
    FeatureBadgeComponent,
    RegistratieComponent,
    LoginComponent,
    AdminBoatOverviewComponent,
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
  ],
  providers: [MatSnackBarModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
