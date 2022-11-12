import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheSessionCaisseComponent } from './recherche-session-caisse.component';

describe('RechercheSessionCaisseComponent', () => {
  let component: RechercheSessionCaisseComponent;
  let fixture: ComponentFixture<RechercheSessionCaisseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechercheSessionCaisseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechercheSessionCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
