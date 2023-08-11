import { TestBed } from '@angular/core/testing';

import { ManageCaregiverAgencyService } from './manage-caregiver-agency.service';

describe('ManageCaregiverAgencyService', () => {
  let service: ManageCaregiverAgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCaregiverAgencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
