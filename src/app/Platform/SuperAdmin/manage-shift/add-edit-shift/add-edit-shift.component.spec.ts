import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShiftComponent } from './add-edit-shift.component';

describe('AddEditCaregiverComponent', () => {
  let component: AddEditShiftComponent;
  let fixture: ComponentFixture<AddEditShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
