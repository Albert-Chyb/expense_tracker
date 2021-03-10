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
});
