import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupChoixTransfertDocumentComponent } from './popup-choix-transfert-document.component';

describe('PopupChoixTransfertDocumentComponent', () => {
  let component: PopupChoixTransfertDocumentComponent;
  let fixture: ComponentFixture<PopupChoixTransfertDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupChoixTransfertDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupChoixTransfertDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
