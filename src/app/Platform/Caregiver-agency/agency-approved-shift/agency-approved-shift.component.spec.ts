import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyApprovedShiftComponent } from './agency-approved-shift.component';

describe('AgencyAppliedShiftComponent', () => {
  let component: AgencyApprovedShiftComponent;
  let fixture: ComponentFixture<AgencyApprovedShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyApprovedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyApprovedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
