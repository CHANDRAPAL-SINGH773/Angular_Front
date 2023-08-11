import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNewNotificationComponent } from './send-new-notification.component';

describe('SendNewNotificationComponent', () => {
  let component: SendNewNotificationComponent;
  let fixture: ComponentFixture<SendNewNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendNewNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendNewNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
