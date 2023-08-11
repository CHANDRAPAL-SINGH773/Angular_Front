import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDiscountCodeComponent } from './add-edit-discount-code.component';

describe('AddEditCaregiverComponent', () => {
  let component: AddEditDiscountCodeComponent;
  let fixture: ComponentFixture<AddEditDiscountCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDiscountCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDiscountCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
