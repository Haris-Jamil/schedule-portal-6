import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionEditModalComponent } from './rejection-edit-modal.component';

describe('RejectionEditModalComponent', () => {
  let component: RejectionEditModalComponent;
  let fixture: ComponentFixture<RejectionEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
