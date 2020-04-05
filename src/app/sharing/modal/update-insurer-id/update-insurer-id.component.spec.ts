import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInsurerIdComponent } from './update-insurer-id.component';

describe('UpdateInsurerIdComponent', () => {
  let component: UpdateInsurerIdComponent;
  let fixture: ComponentFixture<UpdateInsurerIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateInsurerIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInsurerIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
