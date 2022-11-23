import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAvoirAchatListComponent } from './facture-avoir-achat-list.component';

describe('FactureAvoirAchatListComponent', () => {
  let component: FactureAvoirAchatListComponent;
  let fixture: ComponentFixture<FactureAvoirAchatListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureAvoirAchatListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureAvoirAchatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
