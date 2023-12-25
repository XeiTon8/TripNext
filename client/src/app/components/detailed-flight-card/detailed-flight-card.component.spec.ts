import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedFlightCardComponent } from './detailed-flight-card.component';

describe('DetailedFlightCardComponent', () => {
  let component: DetailedFlightCardComponent;
  let fixture: ComponentFixture<DetailedFlightCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedFlightCardComponent]
    });
    fixture = TestBed.createComponent(DetailedFlightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
