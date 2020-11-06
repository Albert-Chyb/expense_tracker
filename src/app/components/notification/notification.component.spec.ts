import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import {
	NotificationType,
	NotificationsPosition,
	NOTIFICATIONS_GLOBAL_SETTINGS,
	NOTIFICATIONS_SETTINGS,
	NOTIFICATIONS_SERVICE,
} from './../../common/models/notifications';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

describe('NotificationComponent', () => {
	let component: NotificationComponent;
	let fixture: ComponentFixture<NotificationComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationComponent],
			imports: [BrowserAnimationsModule],
			providers: [
				{
					provide: NOTIFICATIONS_SETTINGS,
					useValue: NOTIFICATIONS_GLOBAL_SETTINGS,
				},
				{
					provide: NOTIFICATIONS_SERVICE,
					useClass: NotificationsService,
				},
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component['_changeDetector'].reattach();
	});

	beforeEach(() => {
		de = fixture.debugElement.query(By.css('.notification'));
		el = de.nativeElement;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Notification theme bindings', () => {
		it('should append `notification--warning` class if type property is set to warning', () => {
			component.type = NotificationType.Warning;
			fixture.detectChanges();
			expect(el.classList.contains('notification--warning')).toBeTruthy();
		});

		it('should append `notification--danger` class if type property is set to danger', () => {
			component.type = NotificationType.Danger;
			fixture.detectChanges();
			expect(el.classList.contains('notification--danger')).toBeTruthy();
		});

		it('should append `notification--success` class if type property is set to success', () => {
			component.type = NotificationType.Success;
			fixture.detectChanges();
			expect(el.classList.contains('notification--success')).toBeTruthy();
		});

		it('should append `notification--neutral` class if type property is set to neutral', () => {
			component.type = NotificationType.Neutral;
			fixture.detectChanges();
			expect(el.classList.contains('notification--neutral')).toBeTruthy();
		});
	});

	describe('Notification position bindings', () => {
		it('should append `notification--top` class if posY property of config object is set to top', () => {
			component['_config'].posY = NotificationsPosition.Top;
			fixture.detectChanges();
			expect(el.classList.contains('notification--top')).toBeTruthy();
		});

		it('should append `notification--bottom` class if posY property of config object is set to bottom', () => {
			component['_config'].posY = NotificationsPosition.Bottom;
			fixture.detectChanges();
			expect(el.classList.contains('notification--bottom')).toBeTruthy();
		});

		it('should append `notification--left` class if pos property of config object is set to left', () => {
			component['_config'].posX = NotificationsPosition.Left;
			fixture.detectChanges();
			expect(el.classList.contains('notification--left')).toBeTruthy();
		});

		it('should append `notification--right` class if pos property of config object is set to right', () => {
			component['_config'].posX = NotificationsPosition.Right;
			fixture.detectChanges();
			expect(el.classList.contains('notification--right')).toBeTruthy();
		});

		it('should set translateY property based on translationY property', () => {
			component.translationY = 20;
			fixture.detectChanges();

			const transformValue = el.style.getPropertyValue('transform');

			expect(transformValue).toContain('translateY(20px)');
		});
	});

	describe('Notification content bindings', () => {
		it('should append `notification--no-title` class if title property is empty', () => {
			component.title = 'a';
			fixture.detectChanges();

			expect(el.classList.contains('notification--no-title')).toBeFalsy();

			component.title = '';
			fixture.detectChanges();

			expect(el.classList.contains('notification--no-title')).toBeTruthy();
		});

		it('should hide the title if title property is empty', () => {
			component.title = '';
			fixture.detectChanges();
			const titleEl = de.query(By.css('.notification__heading'));

			expect(titleEl).toBeFalsy();
		});

		it('should show the title if title property has a value', () => {
			component.title = 'a';
			fixture.detectChanges();
			const titleEl = de.query(By.css('.notification__heading'));

			expect(titleEl).toBeTruthy();
			expect(titleEl.nativeElement.textContent).toEqual('a');
		});
	});
});
