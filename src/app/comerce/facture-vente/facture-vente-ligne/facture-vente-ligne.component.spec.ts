import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureVenteLigneComponent } from './facture-vente-ligne.component';

describe('FactureVenteLigneComponent', () => {
  let component: FactureVenteLigneComponent;
  let fixture: ComponentFixture<FactureVenteLigneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureVenteLigneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureVenteLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
