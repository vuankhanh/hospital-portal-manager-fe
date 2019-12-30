import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProccessTheRefundRequestComponent } from './proccess-the-refund-request.component';

describe('ProccessTheRefundRequestComponent', () => {
  let component: ProccessTheRefundRequestComponent;
  let fixture: ComponentFixture<ProccessTheRefundRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProccessTheRefundRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProccessTheRefundRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
