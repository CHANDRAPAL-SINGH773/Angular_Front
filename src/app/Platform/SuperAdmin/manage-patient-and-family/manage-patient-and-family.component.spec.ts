import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePatientAndFamilyComponent } from './manage-patient-and-family.component';

describe('ManagePatientAndFamilyComponent', () => {
  let component: ManagePatientAndFamilyComponent;
  let fixture: ComponentFixture<ManagePatientAndFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePatientAndFamilyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePatientAndFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
