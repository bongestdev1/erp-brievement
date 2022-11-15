import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureVenteComponent } from './facture-vente.component';

describe('FactureVenteComponent', () => {
  let component: FactureVenteComponent;
  let fixture: ComponentFixture<FactureVenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureVenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
