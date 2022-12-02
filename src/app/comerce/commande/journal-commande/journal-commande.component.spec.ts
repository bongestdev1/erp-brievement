import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalCommandeComponent } from './journal-commande.component';

describe('JournalCommandeComponent', () => {
  let component: JournalCommandeComponent;
  let fixture: ComponentFixture<JournalCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
