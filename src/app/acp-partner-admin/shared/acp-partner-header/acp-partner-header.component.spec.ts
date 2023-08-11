import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpPartnerHeaderComponent } from './acp-partner-header.component';

describe('AcpPartnerHeaderComponent', () => {
  let component: AcpPartnerHeaderComponent;
  let fixture: ComponentFixture<AcpPartnerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpPartnerHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpPartnerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
