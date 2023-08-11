import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingRequestComponent } from './outgoing-request.component';

describe('OutgoingRequestComponent', () => {
  let component: OutgoingRequestComponent;
  let fixture: ComponentFixture<OutgoingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
