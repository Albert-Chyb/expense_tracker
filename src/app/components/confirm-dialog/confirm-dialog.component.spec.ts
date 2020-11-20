import { DIALOG_REF } from './../../common/models/dialog';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA } from 'src/app/common/models/dialog';

import {
	ConfirmDialogComponent,
	ConfirmDialogData,
} from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
	let component: ConfirmDialogComponent;
	let fixture: ComponentFixture<ConfirmDialogComponent>;
	let dialogData: ConfirmDialogData;

	beforeEach(async(() => {
		dialogData = {
			title: 'A',
			description: 'B',
		};

		TestBed.configureTestingModule({
			declarations: [ConfirmDialogComponent],
			providers: [
				{ provide: DIALOG_DATA, useValue: dialogData },
				{ provide: DIALOG_REF, useValue: {} },
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
