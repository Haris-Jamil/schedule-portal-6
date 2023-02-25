import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCountModalComponent } from './project-count-modal.component';

describe('ProjectCountModalComponent', () => {
  let component: ProjectCountModalComponent;
  let fixture: ComponentFixture<ProjectCountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
