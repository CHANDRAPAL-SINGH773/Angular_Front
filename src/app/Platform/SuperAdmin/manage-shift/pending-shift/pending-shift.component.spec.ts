import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingShiftComponent } from './pending-shift.component';

describe('ManageCaregiverComponent', () => {
  let component: PendingShiftComponent;
  let fixture: ComponentFixture<PendingShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
