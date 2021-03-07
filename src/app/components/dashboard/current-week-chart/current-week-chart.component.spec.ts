import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeekChartComponent } from './current-week-chart.component';

describe('CurrentWeekChartComponent', () => {
  let component: CurrentWeekChartComponent;
  let fixture: ComponentFixture<CurrentWeekChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentWeekChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWeekChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
