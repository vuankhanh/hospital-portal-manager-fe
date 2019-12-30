import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheRequirementsComponent } from './the-requirements.component';

describe('TheRequirementsComponent', () => {
  let component: TheRequirementsComponent;
  let fixture: ComponentFixture<TheRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
