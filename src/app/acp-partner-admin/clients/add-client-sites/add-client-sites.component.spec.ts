import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientSitesComponent } from './add-client-sites.component';

describe('AddClientSitesComponent', () => {
  let component: AddClientSitesComponent;
  let fixture: ComponentFixture<AddClientSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClientSitesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClientSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
