import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverAgencyDashboardComponent } from './caregiver-agency-dashboard.component';

describe('CaregiverAgencyDashboardComponent', () => {
  let component: CaregiverAgencyDashboardComponent;
  let fixture: ComponentFixture<CaregiverAgencyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaregiverAgencyDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverAgencyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
