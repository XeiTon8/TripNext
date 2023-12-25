import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookOrderComponentComponent } from './book-order-component.component';

describe('BookOrderComponentComponent', () => {
  let component: BookOrderComponentComponent;
  let fixture: ComponentFixture<BookOrderComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookOrderComponentComponent]
    });
    fixture = TestBed.createComponent(BookOrderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
