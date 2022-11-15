import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAchatLigneComponent } from './facture-achat-ligne.component';

describe('FactureAchatLigneComponent', () => {
  let component: FactureAchatLigneComponent;
  let fixture: ComponentFixture<FactureAchatLigneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureAchatLigneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureAchatLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
