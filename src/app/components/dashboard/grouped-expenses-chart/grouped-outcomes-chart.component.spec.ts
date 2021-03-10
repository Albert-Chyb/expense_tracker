import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedOutcomesChartComponent } from './grouped-outcomes-chart.component';

describe('GroupedOutcomesChartComponent', () => {
  let component: GroupedOutcomesChartComponent;
  let fixture: ComponentFixture<GroupedOutcomesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedOutcomesChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedOutcomesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
