import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCaregiverAgencyRolePermissionsComponent } from './manage-caregiver-agency-role-permissions.component';

describe('ManageCaregiverAgencyRolePermissionsComponent', () => {
  let component: ManageCaregiverAgencyRolePermissionsComponent;
  let fixture: ComponentFixture<ManageCaregiverAgencyRolePermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCaregiverAgencyRolePermissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCaregiverAgencyRolePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
