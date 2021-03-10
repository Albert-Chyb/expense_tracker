import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodsChartComponent } from './periods-chart.component';

describe('LastMonthsChartComponent', () => {
	let component: PeriodsChartComponent;
	let fixture: ComponentFixture<PeriodsChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PeriodsChartComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PeriodsChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
