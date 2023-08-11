import { TestBed } from '@angular/core/testing';

import { ManageCaregiverShiftService } from './manage-caregiver-shift.service';

describe('ManageCaregiverShiftService', () => {
  let service: ManageCaregiverShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCaregiverShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
