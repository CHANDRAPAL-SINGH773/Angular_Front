import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedShiftComponent } from './completed-shift.component';

describe('ManageCaregiverComponent', () => {
  let component: CompletedShiftComponent;
  let fixture: ComponentFixture<CompletedShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
