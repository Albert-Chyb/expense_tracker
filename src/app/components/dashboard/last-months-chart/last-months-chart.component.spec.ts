import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastMonthsChartComponent } from './last-months-chart.component';

describe('LastMonthsChartComponent', () => {
  let component: LastMonthsChartComponent;
  let fixture: ComponentFixture<LastMonthsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastMonthsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastMonthsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
