import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDetailComponent } from './notification-detail.component';

describe('AddEditCaregiverComponent', () => {
  let component: NotificationDetailComponent;
  let fixture: ComponentFixture<NotificationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
