import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingRequestComponent } from './incoming-request.component';

describe('IncomingRequestComponent', () => {
  let component: IncomingRequestComponent;
  let fixture: ComponentFixture<IncomingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
