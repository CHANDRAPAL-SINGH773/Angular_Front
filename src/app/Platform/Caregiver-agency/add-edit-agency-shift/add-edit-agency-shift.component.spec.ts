import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAgencyShiftComponent } from './add-edit-agency-shift.component';

describe('AddEditAgencyShiftComponent', () => {
  let component: AddEditAgencyShiftComponent;
  let fixture: ComponentFixture<AddEditAgencyShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAgencyShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAgencyShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
