import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBonReceptionComponent } from './details-bon-reception.component';

describe('DetailsBonReceptionComponent', () => {
  let component: DetailsBonReceptionComponent;
  let fixture: ComponentFixture<DetailsBonReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsBonReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBonReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
