import { DialogService } from './../../services/dialog/dialog.service';
import { DIALOG_DATA, DIALOG_SERVICE } from './../../common/models/dialog';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContainerComponent } from './dialog-container.component';

describe('DialogContainerComponent', () => {
	let component: DialogContainerComponent;
	let fixture: ComponentFixture<DialogContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DialogContainerComponent],
			providers: [
				{ provide: DIALOG_DATA, useValue: {} },
				{ provide: DIALOG_SERVICE, useClass: DialogService },
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
