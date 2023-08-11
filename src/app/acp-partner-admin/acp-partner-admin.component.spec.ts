import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpPartnerAdminComponent } from './acp-partner-admin.component';

describe('AcpPartnerAdminComponent', () => {
  let component: AcpPartnerAdminComponent;
  let fixture: ComponentFixture<AcpPartnerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpPartnerAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpPartnerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
