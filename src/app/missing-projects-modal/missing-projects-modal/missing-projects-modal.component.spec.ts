import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingProjectsModalComponent } from './missing-projects-modal.component';

describe('MissingProjectsModalComponent', () => {
  let component: MissingProjectsModalComponent;
  let fixture: ComponentFixture<MissingProjectsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingProjectsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingProjectsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
