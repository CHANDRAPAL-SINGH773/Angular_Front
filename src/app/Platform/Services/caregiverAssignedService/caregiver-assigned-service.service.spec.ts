import { TestBed } from '@angular/core/testing';

import { CaregiverAssignedServiceService } from './caregiver-assigned-service.service';

describe('CaregiverAssignedServiceService', () => {
  let service: CaregiverAssignedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaregiverAssignedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
