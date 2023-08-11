import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcpPartnerSidebarComponent } from './acp-partner-sidebar.component';

describe('AcpPartnerSidebarComponent', () => {
  let component: AcpPartnerSidebarComponent;
  let fixture: ComponentFixture<AcpPartnerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcpPartnerSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcpPartnerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
