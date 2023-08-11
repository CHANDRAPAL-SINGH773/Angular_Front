import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignShiftCaregiverComponent } from './assign-shift-caregiver.component';

describe('AddEditCaregiverComponent', () => {
  let component: AssignShiftCaregiverComponent;
  let fixture: ComponentFixture<AssignShiftCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignShiftCaregiverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignShiftCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
