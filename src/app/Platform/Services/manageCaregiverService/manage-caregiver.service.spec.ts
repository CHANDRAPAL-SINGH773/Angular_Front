import { TestBed } from '@angular/core/testing';

import { ManageCaregiverService } from './manage-caregiver.service';

describe('ManageCaregiverService', () => {
  let service: ManageCaregiverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCaregiverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
