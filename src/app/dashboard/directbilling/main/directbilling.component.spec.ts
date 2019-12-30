import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectbillingComponent } from './directbilling.component';

describe('DirectbillingComponent', () => {
  let component: DirectbillingComponent;
  let fixture: ComponentFixture<DirectbillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectbillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectbillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
