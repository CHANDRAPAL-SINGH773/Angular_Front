import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedInvitedShiftComponent } from './assigned-invited-shift.component';

describe('AgencyAppliedShiftComponent', () => {
  let component: AssignedInvitedShiftComponent;
  let fixture: ComponentFixture<AssignedInvitedShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedInvitedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedInvitedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
