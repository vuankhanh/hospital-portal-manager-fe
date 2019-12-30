import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestARefundComponent } from './request-a-refund.component';

describe('RequestARefundComponent', () => {
  let component: RequestARefundComponent;
  let fixture: ComponentFixture<RequestARefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestARefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestARefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
