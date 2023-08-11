import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAcpPartnerComponent } from './add-acp-partner.component';

describe('AddAcpPartnerComponent', () => {
  let component: AddAcpPartnerComponent;
  let fixture: ComponentFixture<AddAcpPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAcpPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAcpPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
