import { TestBed } from '@angular/core/testing';

import { AddCaregiverService } from './add-caregiver.service';

describe('AddCaregiverService', () => {
  let service: AddCaregiverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCaregiverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
