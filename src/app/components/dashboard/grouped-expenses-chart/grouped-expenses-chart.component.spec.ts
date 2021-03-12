import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedExpensesChartComponent } from './grouped-expenses-chart.component';

describe('GroupedOutcomesChartComponent', () => {
	let component: GroupedExpensesChartComponent;
	let fixture: ComponentFixture<GroupedExpensesChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GroupedExpensesChartComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GroupedExpensesChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('_transformTransactions', () => {
		it('should transform received transitions into chart data format', () => {
			const transactions = [
				{ group: { id: 1, name: 'a' }, amount: -78.55 },
				{ group: { id: 2, name: 'b' }, amount: -81.19 },
				{ group: { id: 3, name: 'c' }, amount: -65.47 },
				{ group: { id: 4, name: 'd' }, amount: -85.72 },
				{ group: { id: 5, name: 'e' }, amount: -11.77 },
				{ group: { id: 1, name: 'a' }, amount: -66.66 },
				{ group: { id: 2, name: 'b' }, amount: -49.91 },
				{ group: { id: 3, name: 'c' }, amount: -35.76 },
				{ group: { id: 4, name: 'd' }, amount: -65.47 },
				{ group: { id: 5, name: 'e' }, amount: -85.72 },
				{ group: { id: 1, name: 'a' }, amount: -11.77 },
				{ group: { id: 2, name: 'b' }, amount: -66.66 },
				{ group: { id: 3, name: 'c' }, amount: -49.91 },
			] as any[];

			component.inView = 4;

			const result = component['_transformTransactions'](transactions);

			expect(result).toHaveSize(4);
			expect(result).toEqual([
				{ name: 'b', value: 197.76 },
				{ name: 'a', value: 156.98 },
				{ name: 'd', value: 151.19 },
				{ name: 'c', value: 151.14 },
				// { name: 'e', value: 97.49 },
			]);
		});
	});
});
