import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCostComponent } from './ticket-cost.component';

describe('TicketCostComponent', () => {
  let component: TicketCostComponent;
  let fixture: ComponentFixture<TicketCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
