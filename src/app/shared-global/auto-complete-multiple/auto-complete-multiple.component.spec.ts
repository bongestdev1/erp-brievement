import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteMultipleComponent } from './auto-complete-multiple.component';

describe('AutoCompleteMultipleComponent', () => {
  let component: AutoCompleteMultipleComponent;
  let fixture: ComponentFixture<AutoCompleteMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
