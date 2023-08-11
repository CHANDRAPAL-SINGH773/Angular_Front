import { TestBed } from '@angular/core/testing';
import { ManagePlanService } from './manage-plan.service';

describe('AddAgencyService', () => {
  let service: ManagePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
