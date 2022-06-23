import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqComponent } from './faq.component';

// 'xdescribe' disables this test, change back to 'describe' to re-enable
xdescribe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
