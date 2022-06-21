import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BoatRequirements, BoatType } from '../../boat';
import { BoatService } from '../../boat.service';
import { SessionService } from '../../session.service';
import { MockBoatService } from '../../test/boat.service.mock';
import { MockBookingService } from '../../test/booking.service.mock';
import { MockSessionService } from '../../test/session.service.mock';
import { BookingService } from '../booking.service';

import { CheckComponent } from './check.component';

const MOCK_BOAT_DETAIL_DATA = {
  id: 1,
  imageRoute: '',
  name: 'DetailBoat',
  requirements: 'none' as BoatRequirements,
  boatType: 'motor' as BoatType,
  maxOccupants: 12,
  enabled: true,
  registrationNumber: 1234,
  pricePerDay: 1234,
  lengthInM: 1234,
  maxSpeedInKmH: 1234,
};

describe('CheckComponent', () => {
  let component: CheckComponent;
  let fixture: ComponentFixture<CheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
    })
      .overrideComponent(CheckComponent, {
        set: {
          providers: [
            {
              provide: ActivatedRoute,
              useValue: {
                snapshot: {
                  paramMap: new Map<string, any>(Object.entries({ id: 1 })),
                },
              },
            },
            { provide: BoatService, useClass: MockBoatService },
            { provide: BookingService, useClass: MockBookingService },
            { provide: SessionService, useClass: MockSessionService },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // buttonEl = button.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error message if unable to read from BookingService', () => {
    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toContain(
      'Er is wat fout gegaan! Probeer het nog eens.'
    );
  });

  describe('Initialize MockBookingService with data, no User', () => {
    let button: DebugElement;
    let buttonEl: HTMLButtonElement;

    beforeEach(async () => {
      component.boat = MOCK_BOAT_DETAIL_DATA;

      fixture.detectChanges();
      await fixture.whenStable();

      button = fixture.debugElement.query(By.css('button'));
      buttonEl = button.nativeElement;
    });

    it('button should ask to login when not logged in', () => {
      expect(buttonEl.textContent).toContain('Log Nu In');
    });
  });

  describe('Initialize MockBookingService with data, MockSessionService with user', () => {
    let button: DebugElement;
    let buttonEl: HTMLButtonElement;

    let bookingService: BookingService;

    beforeEach(async () => {
      component.boat = MOCK_BOAT_DETAIL_DATA;
      bookingService = fixture.debugElement.injector.get(BookingService);

      const sessionService = fixture.debugElement.injector.get(SessionService);

      sessionService.login('test1@test.test', 'password');

      fixture.detectChanges();
      await fixture.whenStable();

      button = fixture.debugElement.query(By.css('button'));
      buttonEl = button.nativeElement;
    });

    it('button should ask to pay when logged in', () => {
      expect(buttonEl.textContent).toContain('Nu betalen');
    });

    it('should be disabled when no date is entered', () => {
      expect(buttonEl.disabled).toBeTrue();
    });

    it('should be disabled when an invalid date is entered', async () => {
      bookingService.setDateRange({
        dateStart: new Date('2022-01-01'),
        dateEnd: new Date('2022-01-02'),
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(buttonEl.disabled).toBeTrue();
    });

    it('should be enabled when a date is entered', async () => {
      bookingService.setDateRange({
        dateStart: new Date('2022-01-01'),
        dateEnd: new Date('2022-01-06'),
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(buttonEl.disabled).toBeFalse();
    });
  });
});
