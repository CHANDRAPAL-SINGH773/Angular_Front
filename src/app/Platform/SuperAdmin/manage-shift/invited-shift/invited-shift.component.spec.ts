import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedShiftComponent } from './invited-shift.component';

describe('ManageCaregiverComponent', () => {
  let component: InvitedShiftComponent;
  let fixture: ComponentFixture<InvitedShiftComponent>;

  beforeEach(async () => {InvitedShiftComponent
    await TestBed.configureTestingModule({
      declarations: [ InvitedShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
