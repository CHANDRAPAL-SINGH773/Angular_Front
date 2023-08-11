import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledShiftComponent } from './cancelled-shift.component';

describe('CancelledShiftComponent', () => {
  let component: CancelledShiftComponent;
  let fixture: ComponentFixture<CancelledShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelledShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelledShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
