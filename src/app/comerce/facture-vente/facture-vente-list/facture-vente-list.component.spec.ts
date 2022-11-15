import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureVenteListComponent } from './facture-vente-list.component';

describe('FactureVenteListComponent', () => {
  let component: FactureVenteListComponent;
  let fixture: ComponentFixture<FactureVenteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureVenteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureVenteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
