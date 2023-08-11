import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedByCaregiverShiftComponent } from './requested-by-caregiver-shift.component';

describe('RequestedByCaregiverShiftComponent', () => {
  let component: RequestedByCaregiverShiftComponent;
  let fixture: ComponentFixture<RequestedByCaregiverShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedByCaregiverShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedByCaregiverShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
