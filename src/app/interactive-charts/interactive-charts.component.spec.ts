import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveChartsComponent } from './interactive-charts.component';

describe('InteractiveChartsComponent', () => {
  let component: InteractiveChartsComponent;
  let fixture: ComponentFixture<InteractiveChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
