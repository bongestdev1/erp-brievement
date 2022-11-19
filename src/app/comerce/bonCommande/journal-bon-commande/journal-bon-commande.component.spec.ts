import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalBonCommandeComponent } from './journal-bon-commande.component';

describe('JournalBonCommandeComponent', () => {
  let component: JournalBonCommandeComponent;
  let fixture: ComponentFixture<JournalBonCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalBonCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalBonCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
