import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyOpenShiftComponent } from './agency-open-shift.component';

describe('AgencyOpenShiftComponent', () => {
  let component: AgencyOpenShiftComponent;
  let fixture: ComponentFixture<AgencyOpenShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyOpenShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyOpenShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
