import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedShiftComponent } from './approved-shift.component';

describe('ManageCaregiverComponent', () => {
  let component: ApprovedShiftComponent;
  let fixture: ComponentFixture<ApprovedShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
