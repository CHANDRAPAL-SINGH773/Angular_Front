import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientAndFamilyComponent } from './add-patient-and-family.component';

describe('AddPatientAndFamilyComponent', () => {
  let component: AddPatientAndFamilyComponent;
  let fixture: ComponentFixture<AddPatientAndFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatientAndFamilyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientAndFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
