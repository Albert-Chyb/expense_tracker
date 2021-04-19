import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HammerModule } from '@angular/platform-browser';

import { SwipeActionsComponent } from './swipe-actions.component';
import 'hammerjs';

describe('SwipeActionsComponent', () => {
	let component: SwipeActionsComponent;
	let fixture: ComponentFixture<SwipeActionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SwipeActionsComponent],
			imports: [HammerModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SwipeActionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
