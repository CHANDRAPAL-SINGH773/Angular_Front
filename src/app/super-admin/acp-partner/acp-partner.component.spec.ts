import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpPartnerComponent } from './acp-partner.component';

describe('AcpPartnerComponent', () => {
  let component: AcpPartnerComponent;
  let fixture: ComponentFixture<AcpPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
