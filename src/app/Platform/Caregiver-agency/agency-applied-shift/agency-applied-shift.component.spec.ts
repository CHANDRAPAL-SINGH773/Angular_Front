import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyAppliedShiftComponent } from './agency-applied-shift.component';

describe('AgencyAppliedShiftComponent', () => {
  let component: AgencyAppliedShiftComponent;
  let fixture: ComponentFixture<AgencyAppliedShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyAppliedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyAppliedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
