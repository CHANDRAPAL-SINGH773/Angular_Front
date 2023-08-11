import { TestBed } from '@angular/core/testing';

import { ManageReferralShiftServiceService } from './manage-referral-shift.service';

describe('ManageReferralShiftServiceService', () => {
  let service: ManageReferralShiftServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageReferralShiftServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
