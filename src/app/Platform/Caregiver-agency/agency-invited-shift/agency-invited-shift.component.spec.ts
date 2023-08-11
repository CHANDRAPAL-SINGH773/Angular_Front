import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyInvitedShiftComponent } from './agency-invited-shift.component';

describe('AgencyOpenShiftComponent', () => {
  let component: AgencyInvitedShiftComponent;
  let fixture: ComponentFixture<AgencyInvitedShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyInvitedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyInvitedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
