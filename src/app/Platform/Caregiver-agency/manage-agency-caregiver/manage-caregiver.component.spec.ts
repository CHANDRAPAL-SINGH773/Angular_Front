import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAgencyCaregiverComponent } from './manage-agency-caregiver.component';

describe('ManageCaregiverComponent', () => {
  let component: ManageAgencyCaregiverComponent;
  let fixture: ComponentFixture<ManageAgencyCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAgencyCaregiverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAgencyCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
