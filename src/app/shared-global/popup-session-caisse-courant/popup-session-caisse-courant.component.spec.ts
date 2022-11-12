import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSessionCaisseCourantComponent } from './popup-session-caisse-courant.component';

describe('PopupSessionCaisseCourantComponent', () => {
  let component: PopupSessionCaisseCourantComponent;
  let fixture: ComponentFixture<PopupSessionCaisseCourantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupSessionCaisseCourantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSessionCaisseCourantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
