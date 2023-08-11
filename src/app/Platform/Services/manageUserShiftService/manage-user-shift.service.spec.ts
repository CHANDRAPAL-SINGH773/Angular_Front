import { TestBed } from '@angular/core/testing';

import { ManageUserShiftService } from './manage-user-shift.service';

describe('AddAgencyService', () => {
  let service: ManageUserShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageUserShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
