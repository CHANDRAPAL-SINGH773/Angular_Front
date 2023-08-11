import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPartnerDetailComponent } from './business-partner-detail.component';

describe('BusinessPartnerDetailComponent', () => {
  let component: BusinessPartnerDetailComponent;
  let fixture: ComponentFixture<BusinessPartnerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPartnerDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPartnerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
