import { PortalModule } from '@angular/cdk/portal';
import { DialogService } from './../../services/dialog/dialog.service';
import { DIALOG_DATA, DIALOG_SERVICE } from './../../common/models/dialog';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogContainerComponent } from './dialog-container.component';

describe('DialogContainerComponent', () => {
	let component: DialogContainerComponent;
	let fixture: ComponentFixture<DialogContainerComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [DialogContainerComponent],
			imports: [PortalModule],
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
