import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAgencyCaregiverComponent } from './add-edit-agency-caregiver.component';

describe('AddEditCaregiverComponent', () => {
  let component: AddEditAgencyCaregiverComponent;
  let fixture: ComponentFixture<AddEditAgencyCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAgencyCaregiverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAgencyCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
