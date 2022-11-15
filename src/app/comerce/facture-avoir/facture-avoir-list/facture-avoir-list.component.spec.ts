import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAvoirListComponent } from './facture-avoir-list.component';

describe('FactureAvoirListComponent', () => {
  let component: FactureAvoirListComponent;
  let fixture: ComponentFixture<FactureAvoirListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureAvoirListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureAvoirListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
