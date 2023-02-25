import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeManagerModalComponent } from './type-manager-modal.component';

describe('TypeManagerModalComponent', () => {
  let component: TypeManagerModalComponent;
  let fixture: ComponentFixture<TypeManagerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeManagerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeManagerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
