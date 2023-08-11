import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCaregiverComponent } from './manage-caregiver.component';

describe('ManageCaregiverComponent', () => {
  let component: ManageCaregiverComponent;
  let fixture: ComponentFixture<ManageCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCaregiverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
