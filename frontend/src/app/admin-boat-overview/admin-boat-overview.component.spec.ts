import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BoatService } from '../boat.service';
import { MockBoatService } from '../test/boat.service.mock';

import { AdminBoatOverviewComponent } from './admin-boat-overview.component';

describe('AdminBoatOverviewComponent', () => {
  let component: AdminBoatOverviewComponent;
  let fixture: ComponentFixture<AdminBoatOverviewComponent>;

  let renderedBoat: HTMLElement;
  let deleteBtn: HTMLButtonElement;
  let putOnMaintenanceBtn: HTMLButtonElement;
  let putOffMaintenanceBtn: HTMLButtonElement;

  let getBoatsSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBoatOverviewComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
    })
      .overrideComponent(AdminBoatOverviewComponent, {
        set: {
          providers: [{ provide: BoatService, useClass: MockBoatService }],
        },
      })
      .compileComponents();
  });

  beforeEach(async () => {
    getBoatsSpy = spyOn(
      MockBoatService.prototype,
      'getBoats'
    ).and.callThrough();
    fixture = TestBed.createComponent(AdminBoatOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    renderedBoat = fixture.debugElement.query(
      By.css('.boat-item')
    ).nativeElement;
    deleteBtn = fixture.debugElement.query(By.css('.delete-btn')).nativeElement;
    putOnMaintenanceBtn = fixture.debugElement.query(
      By.css('.on-maintenance-btn')
    ).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the "getBoats" method of the service must be called when the page loads', async () => {
    await fixture.whenStable();
    expect(getBoatsSpy.calls.count()).toEqual(1);
  });

  it('should render the mocked boat on the page', async () => {
    expect(renderedBoat).toBeTruthy();
    expect(renderedBoat.innerHTML).toContain('De Test Boot');
  });
  it('should delete boat when clicked on the delete button', async () => {
    deleteBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.boat-item'))).toBeFalsy;
  });
  it('should put boat on maintenance when clicked on the put on maintenance button', async () => {
    putOnMaintenanceBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(renderedBoat.innerHTML).toContain('In onderhoud!');
  });
  it('should put boat off maintenance when clicked on the put off maintenance button', async () => {
    putOnMaintenanceBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    putOffMaintenanceBtn = fixture.debugElement.query(
      By.css('.off-maintenance-btn')
    ).nativeElement;

    putOffMaintenanceBtn.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(renderedBoat.innerHTML).not.toContain('In onderhoud!');
  });
});
