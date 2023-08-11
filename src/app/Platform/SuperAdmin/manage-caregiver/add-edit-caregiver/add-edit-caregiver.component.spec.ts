import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCaregiverComponent } from './add-edit-caregiver.component';

describe('AddEditCaregiverComponent', () => {
  let component: AddEditCaregiverComponent;
  let fixture: ComponentFixture<AddEditCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCaregiverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
