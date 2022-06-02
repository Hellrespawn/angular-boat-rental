import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Skipper } from '../skipper';
import { SkipperService } from '../skipper.service';
import { MockSkipperService } from '../test/skipper.service.mock';

import { AdminSkipperOverviewComponent } from './admin-skipper-overview.component';

describe('AdminSkipperOverviewComponent', () => {
  let component: AdminSkipperOverviewComponent;
  let fixture: ComponentFixture<AdminSkipperOverviewComponent>;

  let renderedSkipper: HTMLElement;
  let deleteBtn: HTMLButtonElement;
  let putOnLeaveBtn: HTMLButtonElement;
  let putOffLeaveBtn: HTMLButtonElement;

  let returnAllSkippersSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSkipperOverviewComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
    })
      .overrideComponent(AdminSkipperOverviewComponent, {
        set: {
          providers: [
            { provide: SkipperService, useClass: MockSkipperService },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(async () => {
    returnAllSkippersSpy = spyOn(
      MockSkipperService.prototype,
      'getSkippers'
    ).and.callThrough();
    fixture = TestBed.createComponent(AdminSkipperOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    renderedSkipper = fixture.debugElement.query(
      By.css('.skipper-item')
    ).nativeElement;
    deleteBtn = fixture.debugElement.query(By.css('.delete-btn')).nativeElement;
    putOnLeaveBtn = fixture.debugElement.query(
      By.css('.put-on-leave-btn')
    ).nativeElement;
    // putOffLeaveBtn = fixture.debugElement.query(
    //   By.css('.put-off-leave-btn')
    // ).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the "getSkippers" method of the service must be called when the page loads', async () => {
    await fixture.whenStable();
    expect(returnAllSkippersSpy.calls.count()).toEqual(1);
  });

  it('should render the mocked skipper on the page', async () => {
    expect(renderedSkipper).toBeTruthy();
    expect(renderedSkipper.innerHTML).toContain('Kees');
  });
  it('should put skipper on leave when clicked on the put on leave button', async () => {
    putOnLeaveBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(renderedSkipper.innerHTML).toContain('Op verlof!');
  });
  it('should put skipper off leave when clicked on the put off leave button', async () => {});
  it('should delete skipper when clicked on the delete button', async () => {
    deleteBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(renderedSkipper).toBeFalsy;
  });
});
