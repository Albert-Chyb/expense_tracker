import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayService } from './../../services/overlay/overlay.service';
import { OVERLAY_SERVICE } from './../../common/models/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayComponent } from './overlay.component';

describe('OverlayComponent', () => {
	let component: OverlayComponent;
	let fixture: ComponentFixture<OverlayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OverlayComponent],
			imports: [BrowserAnimationsModule],
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
