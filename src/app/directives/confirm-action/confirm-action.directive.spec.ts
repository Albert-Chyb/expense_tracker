import { Component } from '@angular/core';
import {
	async,
	ComponentFixture,
	inject,
	TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DialogService } from 'src/app/services/dialog/dialog.service';

import { ConfirmDialogData } from './../../components/confirm-dialog/confirm-dialog.component';
import { ConfirmActionDirective } from './confirm-action.directive';

@Component({
	template: `
		<button
			[confirmAction]="confirmDialogData"
			(reject)="onReject()"
			(confirm)="onConfirm()"
			(action)="onAction()"
		>
			A
		</button>
	`,
})
class TestComponent {
	confirmDialogData: ConfirmDialogData = {
		title: 'A',
		description: 'B',
	};
	onConfirm() {}
	onReject() {}
	onAction() {}
}

describe('ConfirmActionDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let directive: ConfirmActionDirective;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ConfirmActionDirective, TestComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		directive = fixture.debugElement
			.query(By.directive(ConfirmActionDirective))
			.injector.get(ConfirmActionDirective);

		fixture.detectChanges();
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	describe('openConfirmDialog', () => {
		it('should open confirm dialog with data passed in input', inject(
			[DialogService],
			(dialog: DialogService) => {
				const spy = spyOn(dialog, 'openConfirm').and.returnValue({
					afterClosed: of(null),
				} as any);

				directive.openConfirmDialog();

				expect(spy).toHaveBeenCalledWith(
					component.confirmDialogData.title,
					component.confirmDialogData.description
				);
			}
		));
	});

	describe('_onDialogCloseCallback', () => {
		it('should emit onConfirm event if true was received as the status', done => {
			directive.onConfirm.subscribe(() => {
				expect(true).toBeTruthy();
				done();
			});

			directive['_onDialogCloseCallback'](true);
		});

		it('should emit onReject event if false was received as the status', done => {
			directive.onReject.subscribe(() => {
				expect(true).toBeTruthy();
				done();
			});

			directive['_onDialogCloseCallback'](false);
		});

		it('should emit onAction if any action happened', () => {
			const spy = spyOn(directive.onAction, 'emit');

			directive['_onDialogCloseCallback'](false);
			expect(spy).toHaveBeenCalledWith(false);

			directive['_onDialogCloseCallback'](true);
			expect(spy).toHaveBeenCalledWith(true);
		});
	});
});
