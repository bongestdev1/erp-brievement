import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBonReceptionComponent } from './list-bon-reception.component';

describe('ListBonReceptionComponent', () => {
  let component: ListBonReceptionComponent;
  let fixture: ComponentFixture<ListBonReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBonReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBonReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
