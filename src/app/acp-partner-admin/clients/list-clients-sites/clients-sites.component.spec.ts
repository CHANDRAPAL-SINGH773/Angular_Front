import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsSitesComponent } from './clients-sites.component';

describe('ClientsSitesComponent', () => {
  let component: ClientsSitesComponent;
  let fixture: ComponentFixture<ClientsSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsSitesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
