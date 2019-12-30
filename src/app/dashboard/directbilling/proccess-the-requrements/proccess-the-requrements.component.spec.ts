import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProccessTheRequrementsComponent } from './proccess-the-requrements.component';

describe('ProccessTheRequrementsComponent', () => {
  let component: ProccessTheRequrementsComponent;
  let fixture: ComponentFixture<ProccessTheRequrementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProccessTheRequrementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProccessTheRequrementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
