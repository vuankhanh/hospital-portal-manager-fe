import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonInputComponent } from './reason-input.component';

describe('ReasonInputComponent', () => {
  let component: ReasonInputComponent;
  let fixture: ComponentFixture<ReasonInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
