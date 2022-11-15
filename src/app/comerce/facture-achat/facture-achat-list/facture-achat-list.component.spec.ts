import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAchatListComponent } from './facture-achat-list.component';

describe('FactureAchatListComponent', () => {
  let component: FactureAchatListComponent;
  let fixture: ComponentFixture<FactureAchatListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureAchatListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureAchatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
