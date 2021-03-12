import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeekChartComponent } from './current-week-chart.component';

describe('CurrentWeekChartComponent', () => {
	let component: CurrentWeekChartComponent;
	let fixture: ComponentFixture<CurrentWeekChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CurrentWeekChartComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CurrentWeekChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('_transformTransactions', () => {
		it('should transform received transaction into chart data', () => {
			const transactions = [
				{ date: { toDate: () => new Date(2021, 2, 1) }, amount: -78.55 },
				{ date: { toDate: () => new Date(2021, 2, 2) }, amount: -81.19 },
				{ date: { toDate: () => new Date(2021, 2, 3) }, amount: -65.47 },
				{ date: { toDate: () => new Date(2021, 2, 4) }, amount: -85.72 },
				{ date: { toDate: () => new Date(2021, 2, 5) }, amount: -11.77 },
				{ date: { toDate: () => new Date(2021, 2, 6) }, amount: -66.66 },
				{ date: { toDate: () => new Date(2021, 2, 7) }, amount: -49.91 },
				{ date: { toDate: () => new Date(2021, 2, 1) }, amount: -35.76 },
				{ date: { toDate: () => new Date(2021, 2, 2) }, amount: -65.47 },
				{ date: { toDate: () => new Date(2021, 2, 3) }, amount: -85.72 },
				{ date: { toDate: () => new Date(2021, 2, 4) }, amount: -11.77 },
				{ date: { toDate: () => new Date(2021, 2, 5) }, amount: -66.66 },
				{ date: { toDate: () => new Date(2021, 2, 6) }, amount: -49.91 },
			] as any[];

			const result = component['_transformTransactions'](transactions);

			expect(result).toEqual([
				114.31,
				146.66,
				151.19,
				97.49,
				78.43,
				116.57,
				49.91,
			]);
		});
	});
});
