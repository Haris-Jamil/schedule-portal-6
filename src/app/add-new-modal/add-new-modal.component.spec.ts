import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewModalComponent } from './add-new-modal.component';

describe('AddNewModalComponent', () => {
  let component: AddNewModalComponent;
  let fixture: ComponentFixture<AddNewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
