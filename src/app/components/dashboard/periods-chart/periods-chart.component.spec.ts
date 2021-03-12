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

	describe('_transformPeriods', () => {
		it('should transform periods into chart data format', () => {
			const periods = [
				{
					incomes: 177.47,
					outcomes: 49.73,
					date: {
						start: { toDate: () => new Date() },
						end: { toDate: () => new Date() },
					},
				},
				{
					incomes: 77.99,
					outcomes: 50.31,
					date: {
						start: { toDate: () => new Date() },
						end: { toDate: () => new Date() },
					},
				},
				{
					incomes: 97.71,
					outcomes: 33.33,
					date: {
						start: { toDate: () => new Date() },
						end: { toDate: () => new Date() },
					},
				},
			] as any[];

			const result = component['_transformPeriods'](periods);

			expect(result[0]).toEqual([97.71, 77.99, 177.47]);
			expect(result[1]).toEqual([33.33, 50.31, 49.73]);
			expect(result[2]).toBeTruthy();
		});
	});
});
