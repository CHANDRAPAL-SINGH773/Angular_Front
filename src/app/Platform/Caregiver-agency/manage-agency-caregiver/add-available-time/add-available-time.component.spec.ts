import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAvailableTimeComponent } from './add-available-time.component';

describe('AddEditCaregiverComponent', () => {
  let component: AddAvailableTimeComponent;
  let fixture: ComponentFixture<AddAvailableTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAvailableTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAvailableTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
