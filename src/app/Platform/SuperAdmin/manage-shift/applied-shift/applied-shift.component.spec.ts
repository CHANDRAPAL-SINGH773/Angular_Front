import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedShiftComponent } from './applied-shift.component';

describe('ManageCaregiverComponent', () => {
  let component: AppliedShiftComponent;
  let fixture: ComponentFixture<AppliedShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
