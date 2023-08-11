import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpPartnerDocComponent } from './acp-partner-doc.component';

describe('AcpPartnerDocComponent', () => {
  let component: AcpPartnerDocComponent;
  let fixture: ComponentFixture<AcpPartnerDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpPartnerDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpPartnerDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
