import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrixSpecifiqueTypeTierComponent } from './prix-specifique-type-tier.component';

describe('PrixSpecifiqueTypeTierComponent', () => {
  let component: PrixSpecifiqueTypeTierComponent;
  let fixture: ComponentFixture<PrixSpecifiqueTypeTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrixSpecifiqueTypeTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrixSpecifiqueTypeTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
