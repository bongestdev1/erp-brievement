import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteTypeTiersComponent } from './auto-complete-type-tiers.component';

describe('AutoCompleteTypeTiersComponent', () => {
  let component: AutoCompleteTypeTiersComponent;
  let fixture: ComponentFixture<AutoCompleteTypeTiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteTypeTiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteTypeTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
