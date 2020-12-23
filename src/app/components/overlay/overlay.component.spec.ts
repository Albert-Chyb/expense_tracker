import { PortalModule } from '@angular/cdk/portal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayService } from './../../services/overlay/overlay.service';
import { OVERLAY_SERVICE } from './../../common/models/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverlayComponent } from './overlay.component';

describe('OverlayComponent', () => {
	let component: OverlayComponent;
	let fixture: ComponentFixture<OverlayComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [OverlayComponent],
			imports: [BrowserAnimationsModule, PortalModule],
			providers: [{ provide: OVERLAY_SERVICE, useClass: OverlayService }],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OverlayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
