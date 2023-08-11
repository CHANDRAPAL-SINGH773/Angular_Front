import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSubscriptionPlanComponent } from './add-edit-subscription-plan.component';

describe('AddEditCaregiverComponent', () => {
  let component: AddEditSubscriptionPlanComponent;
  let fixture: ComponentFixture<AddEditSubscriptionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSubscriptionPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
