import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcpPartnerComponent } from './list-acp-partner.component';

describe('ListAcpPartnerComponent', () => {
  let component: ListAcpPartnerComponent;
  let fixture: ComponentFixture<ListAcpPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAcpPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAcpPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
