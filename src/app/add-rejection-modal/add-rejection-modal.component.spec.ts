import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRejectionModalComponent } from './add-rejection-modal.component';

describe('AddRejectionModalComponent', () => {
  let component: AddRejectionModalComponent;
  let fixture: ComponentFixture<AddRejectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRejectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRejectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
