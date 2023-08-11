import { TestBed } from '@angular/core/testing';

import { CaregiverAgencyRolePermissionService } from './caregiver-agency-role-permission.service';

describe('CaregiverAgencyRolePermissionService', () => {
  let service: CaregiverAgencyRolePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaregiverAgencyRolePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
