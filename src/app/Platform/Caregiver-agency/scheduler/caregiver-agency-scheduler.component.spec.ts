import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverAgencySchedulerComponent } from './caregiver-agency-scheduler.component';

describe('SchedulerComponent', () => {
  let component: CaregiverAgencySchedulerComponent;
  let fixture: ComponentFixture<CaregiverAgencySchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaregiverAgencySchedulerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverAgencySchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
