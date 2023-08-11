import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpPartnerProfileComponent } from './acp-partner-profile.component';

describe('AcpPartnerProfileComponent', () => {
  let component: AcpPartnerProfileComponent;
  let fixture: ComponentFixture<AcpPartnerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpPartnerProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpPartnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
