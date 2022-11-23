import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAvoirAchatComponent } from './facture-avoir-achat.component';

describe('FactureAvoirAchatComponent', () => {
  let component: FactureAvoirAchatComponent;
  let fixture: ComponentFixture<FactureAvoirAchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureAvoirAchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureAvoirAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
