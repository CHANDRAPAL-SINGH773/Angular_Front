import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyCompletedShiftComponent } from './agency-completed-shift.component';

describe('AgencyCompletedShiftComponent', () => {
  let component: AgencyCompletedShiftComponent;
  let fixture: ComponentFixture<AgencyCompletedShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyCompletedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyCompletedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
