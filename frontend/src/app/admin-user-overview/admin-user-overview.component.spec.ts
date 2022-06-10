import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FineService } from '../fine.service';
import { MockUserService } from '../test/user.service.mock';
import { UserService } from '../user.service';

import { AdminUserOverviewComponent } from './admin-user-overview.component';

describe('AdminUserOverviewComponent', () => {
  let component: AdminUserOverviewComponent;
  let fixture: ComponentFixture<AdminUserOverviewComponent>;

  let renderedUser: HTMLElement;
  let deleteBtn: HTMLButtonElement;
  let putOnBlockedBtn: HTMLButtonElement;
  let putOffBlockedBtn: HTMLButtonElement;

  let getUsersSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserOverviewComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
    })
      .overrideComponent(AdminUserOverviewComponent, {
        set: {
          providers: [
            { provide: UserService, useClass: MockUserService },
            { provide: MatDialog },
            { provide: FineService },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(async () => {
    getUsersSpy = spyOn(
      MockUserService.prototype,
      'getUsers'
    ).and.callThrough();
    fixture = TestBed.createComponent(AdminUserOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    renderedUser = fixture.debugElement.query(
      By.css('.user-item')
    ).nativeElement;
    deleteBtn = fixture.debugElement.query(By.css('.delete-btn')).nativeElement;
    putOnBlockedBtn = fixture.debugElement.query(
      By.css('.put-on-blocked-btn')
    ).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the "getUsers" method of the service must be called when the page loads', async () => {
    await fixture.whenStable();
    expect(getUsersSpy.calls.count()).toEqual(1);
  });

  it('should render the mocked user on the page', async () => {
    expect(renderedUser).toBeTruthy();
    expect(renderedUser.innerHTML).toContain('Kees');
  });

  it('should delete user when clicked on the delete button', async () => {
    deleteBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.user-item'))).toBeFalsy;
  });

  it('should put user on blocked when clicked on the put on blocked button', async () => {
    putOnBlockedBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(renderedUser.innerHTML).toContain('Geblokkeerd!');
  });

  it('should put user off blocked when clicked on the put off blocked button', async () => {
    putOnBlockedBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    putOffBlockedBtn = fixture.debugElement.query(
      By.css('.put-off-blocked-btn')
    ).nativeElement;

    putOffBlockedBtn.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(renderedUser.innerHTML).not.toContain('Geblokkeerd!');
  });
});
